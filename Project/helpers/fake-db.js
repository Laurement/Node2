const data = {}
let lastId = 0

const initData = [
  {name: 'Delta', priceEur: 1.23},
  {name: 'Alpha', priceEur: 4.56},
  {name: 'Charlie', priceEur: 7.89},
  {name: 'Bravo', priceEur: 10.11},
]
const initPromise = Promise.all(initData.map(addPromise))

module.exports = {
  /**
   * Ajoute un enregistrement. Un champ id est généré automatiquement.
   *
   * Si l'argument callback est omis, alors la fonction retourne une Promise.
   *
   * Le premier argument de la callback est une erreur en cas d'erreur, sinon
   * null ; le deuxième argument est le résultat de l'opération.
   *
   * En cas de succès, une copie du nouvel enregistrement est retournée par la
   * callback ou la promise.
   */
  add(record, callback) {
    return callbackOrPromise(addPromise, [record], callback)
  },
  /**
   * Obtient un enregistrement à partir de son id.
   *
   * Si aucun enregistrement ne correspond l'id qui est passée, alors le
   * résultat de l'opération sera null (et non pas une erreur).
   *
   * Si l'argument callback est omis, alors la fonction retourne une Promise.
   *
   * Le premier argument de la callback est une erreur en cas d'erreur, sinon
   * null ; le deuxième argument est le résultat de l'opération.
   *
   * En cas de succès, une copie de l'enregistrement est retournée par la
   * callback ou la promise.
   */
  getOne(id, callback) {
    return callbackOrPromise(getOnePromise, [id], callback)
  },
  /**
   * Obtient la liste de tous les enregistrements dans l'ordre de leur création.
   *
   * Si l'argument callback est omis, alors la fonction retourne une Promise.
   *
   * Le premier argument de la callback est une erreur en cas d'erreur, sinon
   * null ; le deuxième argument est le résultat de l'opération.
   *
   * Le résultat de l'opération est un array contenant une copie des
   * enregistrements présents en db.
   */
  getAll(callback) {
    return callbackOrPromise(getAllPromise, [], callback)
  },
}

function callbackOrPromise(func, args, callback) {
  if (callback) {
    func(...args)
      .then(result => callback(null, result))
      .catch(err => callback(err))
  } else {
    return func(...args)
  }
}

async function addPromise(record) {
  return addSync(record)
}

function addSync(record) {
  const id = ++lastId
  data[id] = {...record, id}
  return {...data[id]}
}

async function getOnePromise(id) {
  const record = data[id]
  if (record) {
    return {...record}
  } else {
    return null
  }
}

async function getAllPromise() {
  return Object.keys(data)
    .map(id => ({...data[id]}))
    .sort((a, b) => a.id - b.id)
}
