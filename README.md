# Evaluation NodeJS 2 - 08.03.18

## Equipe Quattro:

- Guigue Nicolas
- Charles-Dufant Erwin
- Gillet Alexandre
- Catarino Laure

---

## Doc

Commencer par récupérer le projet 

```bash
git clone http://gitlab.it-squad.fr/Lightnyng/Node2
```

Ensuite lancer votre container

```bash
docker-compose up
```

Dans un autre terminal, installer les dépendances npm

```bash
docker-composer exec server npm install
```

Votre container est désormais opérationnel et accessible à cette 
[url](http://localhost:8000)

ENJOY :sunglasses:

---

## Consignes

- Démarrez votre projet à partir d'un clone de ce repository.

- Documentez toute étape de configuration nécessaire pour pouvoir travailler sur
  votre projet à partir d'un clone du repository.

- Créez un fichier `docker-compose.yml` qui permet de faire tourner votre projet.

- Les noms / pseudo de chacun des membres du groupe doivent apparaître dans les
  commits.

- Les fonctions IO (e.g. lecture de fichier) synchrones sont interdites.

- La propreté du code (indentation, cohérence des styles de nommage, etc.) vaut
  pour 1/4 de la note.

- L'élégance et la lisibilité du code vaut pour 1/4 de la note.

  - Principe DRY : évitez les grosses duplications de code.

  - Essayez de découper votre application en modules (fichiers) cohérents.

  - Pour la lisibilité de votre code, n'hésitez pas à introduire des variables
    et fonctions simples qui découpent le code en petites unités plus simples à
    comprendre. Le choix judicieux des noms de variables et des fonctions est
    essentiel.

  - Votre code doit être en Anglais ou en Français. Essayez de vous tenir à une
    langue principale ; néanmoins le mélange de l'Anglais et du Français ne sera
    pas pénalisé. Mieux vaut un nom dans l'autre langue qu'un mauvais nom, ou
    l'absence d'un nom où il en aurait fallu un.

---

## Code fourni

Le code et les données fournis sont dans le dossier `helpers` à la racine du
projet. Il est interdit de modifier le code dans ce dossier pour le rendre
synchrone ! Vous pouvez le modifier pour l'améliorer par contre si vous le
souhaitez.

Le module `fake-db` permet de simuler le fonctionnement de certaines opérations
d'une DB. Les données sont conservées en mémoire vive ; elles sont donc perdues
à chaque redémarrage de l'application.

---

## Specs

### Général

- Créez un site web sur la base d'une application Express.

  - Vous êtes autorisés à utiliser l'utilitaire
    [`express-generator`](http://expressjs.com/en/starter/generator.html).
    Attention, d'après ce que j'ai vu le support pour les templates hjs est
    cassé donc, si vous souhaitez utiliser des templates avec syntaxe Mustache,
    utilisez l'option `--hogan` (malgré le warning).

  - Si vous utilisez le generator, pensez à supprimer les pages qui ne nous
    intéressent pas.

- Le site doit logger toutes les requêtes HTTP entrantes dans la console. Le
  format de log est libre.

- Le site doit stylisé (CSS).

- Notre (fake) base de donnée n'est pas vulnérable à des injections de code.

- Le site par contre est vulnérable aux attaques XSS ; les inputs utilisateurs
  (ré)affichés sur le site doivent donc être escapés correctement.

- Toutes les pages du site doivent afficher un header avec le titre du site (à
  définir de manière démocratique ou non entre les différents membre du groupe).

- Toutes les pages du site doivent afficher un footer contenant un lien de
  contact pointant vers une adresse email@example.com.

- Le code du header et du footer **doit** être DRY (i.e. ne pas être répété).

### Page "Bienvenue"

- L'URL racine du site '/' affiche la page de bienvenue.

- La page affiche un message de bienvenue, voire même du graphisme.

- La page contient un bouton "Démarrer". Lorsqu'on clique sur ce bouton, un
  compte à rebours est affiché. Celui-ci affiche 3, 2, 1 à un interval d'une
  seconde puis change l'URL (`window.location.href = '/nouvelle-url'`) de la
  page lorsqu'il arrive à 0.

  - Si vous n'avez pas de développeur JS frontend dans votre groupe, mais à
    quoi est-ce que vous pensiez lorsque vous avez formé cette équipe de
    développement ??

### Page "Liste"

- Affiche la liste des enregistrements présents dans la (fake) DB.

  - Cf. fichier `helpers/fake-db.js`

- Affiche le nom et le prix pour chacun des éléments de la liste.

- Chaque élément de la liste contient un lien vers la page de détail pour cet
  élément.

- La page "Liste" contient un lien vers la page "Ajout".

#### Devises

- La page "Liste" contient des liens qui permettent de changer la devise avec
  laquelle sont affichés les prix.

- Utilisez le fichier 'forex.json' fourni pour les données.

  - https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback

  - Convertir une string JSON en objet : `const obj = JSON.parse(json)`

  - Les données sont supposées pouvoir changer de minute en minute ; le contenu
    du fichier doit donc être lu à nouveau à chaque fois qu'il doit être utilisé.

- La page doit contenir un lien pour chacune des devises présentes dans le
  fichier (e.g. AUD, BGN, etc.).

- Lorsqu'on clique sur un de ces liens, la page est rechargée et les prix sont
  alors converti dans la devise choisie (à partir de la base EUR).

- Vous pouvez utiliser des paramètres de query du type 'ma-page?cur=AUD' (cf.
  http://expressjs.com/en/4x/api.html#req.query)

### Page "Détail"

- Affiche le nom de l'élément.

- Affiche le prix de l'élément en EUR.

- Affiche le prix de l'élément dans chacune des devises disponibles dans le
  fichier `forex.json` fourni (cf. section précédente).

### Page "Ajout"

- Contient un formulaire permettant d'ajouter un élément à notre fake DB.

- Doit permettre de saisir au moins les champs "nom" et "prix en euro".

- Si les données sont invalides (e.g. champ manquant), afficher à nouveau le
  formulaire avec un message d'erreur (vous pouvez renvoyer le code HTML
  directement en réponse au POST).

- Si les données sont valides, alors l'enregistrement est ajouté dans la (fake)
  DB.

- Si l'enregistrement est réussi alors redirigez vers la même page "Ajout" avec
  un message indiquant le succès de l'opération.

  - Vous pouvez utiliser un
    [paramètre de query](http://expressjs.com/en/4x/api.html#req.query) pour
    savoir que la page est chargée après un enregistrement réussi.

- La page "Ajout" contient un lien vers la page "Liste".

### Section privée

- L'accès à toute URL qui commence par `/private` est interdit.

- Un message d'interdiction est affiché lorsque l'on essaye d'accéder à ces URL.

- Le code de status approprié doit être renvoyé.

### Fake popularité

- Entre la 49ème et la 59ème minute de chaque heure, toutes les pages du site
  doivent être remplacée par une page qui indique : "Site trop populaire
  actuellement. Veuillez réessayer plus tard."

  - Obtenir les minutes de l'heure courante : `new Date().getMinutes()`

- Le code de status approprié doit être renvoyé avec la page "Trop populaire."
