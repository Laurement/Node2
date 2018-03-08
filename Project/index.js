const express = require('express')
const morgan = require('morgan')
const consolidate = require('consolidate')
const fs = require('fs')
const port = 8000;
const BDD = require('./helpers/fake-db')

const app = express()
app.engine('html', consolidate.mustache)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')


const loggingMiddleware = morgan('tiny')

app.use('/js', express.static(__dirname + '/public/scripts_js'))
app.use('/css', express.static(__dirname + '/public/scripts_css'))
app.use('/pictures', express.static(__dirname + '/public/pictures'))
app.use(loggingMiddleware)
app.use(express.urlencoded({
    extended:true,
}))
app.use(express.json())

// Fake Notification
app.use(function(req, res, next){
  const int_minute = new Date().getMinutes();
  const int_hours = new Date().getHours();
  console.log(int_hours)
  if((int_hours == 11 ) || (int_hours == 18 && int_minute < 31) ){
    //res.status(418).send("Désolé, c'est l'heure du thé !!! <img src='https://authoritynutrition.com/wp-content/uploads/2016/05/redhead-drinking-a-cup-of-tea.jpg'></img>")
    res.status(418).render('layout', {
      partials: {
        main: 'Erreur418'
      },
      titleFirstPage: "LOL",
    })
  }else if(false){ // int_minute > 47 && int_minute < 47
    res.status(503).send('Site Vraiment trop populaire Actuellement')
  }else{
    next();
  }
});

//Welcome - First Page
app.get('/', (req, res) => {
  res.render('layout', {
    partials: {
      main: 'welcome'
    },
    titleFirstPage: "Bienvenue",
    startButton: "Démarrer",
  })
})

//Second Page after the Welcome Page
app.get('/welcome', (req, res) => {
  res.render('layout', {
    partials: {
      main: 'welcome2'
    },
    titleSecondPage: "Vous revoilà !",
  })
})

//List all of the price and name form the -fake- BDD
app.get('/list', (req, res) => {
  new Promise(function(resolve, reject) {
    fs.readFile('./helpers/forex.json','utf8' ,(err,data) => {
      const obj = JSON.parse(data)
      const rates = obj["rates"]
      if(rates){
        resolve(rates)
      }else{
        reject("Erreur")
      }
    })
  })
  .then((data) => {
    let currency = data
    BDD.getAll()
    .then((data) => {
      let tabCurrency = []
      for(var prop in currency){
        tabCurrency.push(prop)
      }
      if(data){
        res.render('layout', {
          partials: {
            main: 'list',
          },
          currency : "EUR",
          allCurrency: tabCurrency,
          Pagelist: data,
          visibleButtonEuro: false

        })
      }else {
        res.render('layout', {
          partials: {
            main: 'list',
          },
          Pagelist: 'Il n\'a pas de liste à l\'heure actuelle'
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
})

//Get all list of elements according to currency past in params
app.get('/list/:currency', (req, res) => {
  if(req.params.currency == "EUR"){
     res.redirect('/list');
  }else{
    new Promise(function(resolve, reject) {
      fs.readFile('./helpers/forex.json','utf8' ,(err,data) => {
        const obj = JSON.parse(data)
        const rates = obj["rates"]
        if(rates){
          resolve(rates)
        }else{
          reject("Erreur")
        }
      })
    })
    .then((data) => {
        let currencies = data
        if(data[req.params.currency]){
          let currency = data[req.params.currency]
          BDD.getAll()
          .then((data) => {
            data.forEach(value => {
              value['priceEur'] = value['priceEur'] * currency
            })
            return data
          })
          .then((data) => {
            let tabCurrency = []
            for(var prop in currencies){
              tabCurrency.push(prop)
            }
            res.render('layout', {
              partials: {
                main: 'list',
              },
              currency : req.params.currency,
              Pagelist: data,
              allCurrency: tabCurrency,
              visibleButtonEuro: true,
            })
          })
          .catch(err => {
            console.log(err)
          })
        }else{
          res.status("404").send("Aucune ressources trouvées")
        }
    })
    .catch((err) => {
      console.log(err)
    })
  }
})

app.get('/detail/:id', (req, res) => {
  new Promise(function(resolve, reject) {
    fs.readFile('./helpers/forex.json','utf8' ,(err,data) => {
      const obj = JSON.parse(data)
      const rates = obj["rates"]
      if(rates){
        resolve(rates)
      }else{
        reject("Erreur")
      }
    })
  })
  .then((data) => {
    let currencies = data
    BDD.getOne(req.params.id)
    .then((data) => {
      let prices = []
      for(var prop in currencies){
        prices.push({
          name: prop,
          value: currencies[prop] * data.priceEur
        })
      }
      if(data){
        console.log(prices)
        res.render('layout', {
          partials: {
            main: 'detail'
          },
          name: data.name,
          price: data.priceEur,
          allPrices: prices
        })
      }else{
        res.render('layout', {
          partials: {
            main: 'detail'
          },
          noRessources: "Aucune ressources trouvées"
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  })
  .catch((err) => {
    console.log(err)
  })
})

//Show form for adding new element
app.get('/add', (req, res) => {
  res.render('layout', {
    partials: {
      main: 'add'
    },
    errorName: false,
    errorPrice: false,
  })
})

//Adding new element in the -fake- BDD
app.post('/add', (req, res) => {
  if(req.body.name != "" && req.body.priceEur != "" && req.body.priceEur > 0){
    BDD.add(req.body)
    .then((data) => {
      if(data){
        res.render('layout', {
          partials: {
            main: 'add'
          },
          validate: "Element ajouté avec succès"
        })
      }else{
        res.render('layout', {
          partials: {
            main: 'add'
          },
          error: "Erreur"
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }else{
    let errorN = false
    let errorP = false
    let valueN = ""
    let valueP = ""
    if(req.body.name == ""){
      errorN = true
    }else{
      valueN = req.body.name
    }
    if(req.body.priceEur == "" || req.body.priceEur < 0 || req.body.priceEur == 0){
      errorP = true
    }
    else{
      valueP = req.body.priceEur
    }
    res.render('layout', {
      partials: {
        main: 'add'
      },
      errorName: errorN,
      errorPrice: errorP,
      valueName: valueN,
      valuePrice: valueP,
      messageName: "Veuillez rentrer un nom",
      messagePrice: "Veuillez rentrer un prix, supérieur à 0"
    })
  }
})

//Private page
app.get('/private', (req, res) => {
  res.status('401').send("Interdiction d'accéder à cette page.")
})

//Private page
app.get('/private/*', (req, res) => {
  res.status('401').send("Interdiction d'accéder à cette page.")
})


app.listen(port, err => {
  if(err){
      console.error('Failed to launch server')
  }else{
      console.info(`Listening ${port}`)
  }
})
