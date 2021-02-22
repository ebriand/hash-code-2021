# Hash Code Tooling

Judge : https://hashcodejudge.withgoogle.com/#/home

## Scripts

- Lancer une résolution sur tous les fichiers d'entrée, en parallèle : `npm run all`
- Lancer une résolution sur un fichier d'entrée : `npm run input:1`, `npm run input:2`, ...
- Tests : `npm test`
- Commit, zip, soumission au juge puis tag avec le score reçu : `npm run submit`
- Génère une nouvelle fonction avec son test : `npm run scaffold <functionName>`

## Fonctions utilitaires

- [Assert](https://nodejs.org/dist/latest-v6.x/docs/api/assert.html)
- [Lodash](https://lodash.com), évidemment
- [Debug](https://www.npmjs.com/package/debug)
- Parsing du fichier d'entrée : [`jolicitron`](https://www.npmjs.com/package/jolicitron)
- Manipulations de grilles / matrices 2D : [`grid-utils.js`](https://github.com/hgwood/hash-code-2017-qualifications/blob/master/grid-utils.js)

## Préparation de l'environnement de dev

- Editeur recommandé : Visual Studio Code
  - Auto-complétion excellente, très utile pour lodash
  - Debugger intégré, et configuration fournie dans ce repo (F5 pour lancer)
- Configurer editorconfig dans l'éditeur avec auto-fix on save
- Configurer eslint dans l'éditeur avec auto-fix on save
- Configurer prettier dans l'éditeur avec format on save
- Se familiariser avec la signature des fonctions utilitaires

## Configuration

Trois options sont configurables :

- Dossier où sont téléchargés l'énoncé et les fichiers d'entrée par `npm run download` : variable d'environnement `DOWNLOAD_DIR` ou `config.downloadDir` dans `package.json`, vide par défaut (équivalent au dossier de travail)
- Dossier où sont déposées les archives de sources : variable d'environnement `BUILD_DIR` ou `config.buildDir` dans `package.json`, `.builds` par défaut
- Dossier où sont déposées les solutions : variable d'environnement `SOLUTION_DIR` ou `config.solutionDir` dans `package.json`, vide par défaut (équivalent au dossier de travail)

Les variables d'environnement peuvent être renseignée dans un fichier [`.env`](https://www.npmjs.com/package/dotenv).

## Préparation juste avant le challenge

- Forker et cloner ce repo
- Exécuter `sh ./gcloud-auth-init.sh` et suivre les instructions pour se connecter au compte Google du Hash Code.
- Exécuter `npm ci`

## Checklist de début de challenge

- Lancer `npm run init` (ce script télécharge énoncé et fichiers d'entrée, remplit les sections `config` et `scripts` du `package.json` utilisé par les autres scripts, commit le tout, et enfin crée des fichiers de sortie vide)

## Conseils

- Pusher rapidement sur GitHub pour mettre à disposition de l'équipe
- Faire des fonctions indépendantes testées
  - Utiliser le script de scaffolding pour aller vite
  - Permet à toute l'équipe de profiter de la fonction
  - Permet d'écrire des fonctions et des tests petits
  - Permet de perdre moins de temps en debug
- Faire des tests très simples pour ne pas perdre de temps en debug
- Utiliser `assert` pour vérifier que tout va bien au milieu des fonctions et ne pas perdre de temps en debug
- Utiliser `debug` en dernier recours (i.e. préférer tests et assertions) pour afficher des valeurs

## Analyse des jeux de données avec SQL

- Lancer une base de données PostgreSQL avec `npm run pg:run`
- Dans `pg-load.js`, implémenter la fonction `insertDataSet` qui insère un jeu de données en base
- Exécuter `pg-load.js *.in.json` qui va créer une base de données par jeu de données
- Lancer `npm run pg:psql` pour avoir une REPL SQL pour explorer les jeux de données
  - `\l` pour lister les bases de données (jeux de données)
  - `\c <database>` pour changer de base de données (jeux de données)
  - `\dt` pour lister les tables
  - `\d <table>` pour décrire une table
  - `\q` pour quitter
- `npm run pg:stop` et `npm run pg:rm` sont aussi disponibles pour arrêter et supprimer le conteneur Postgres respectivement
