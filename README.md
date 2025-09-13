# Choix technologiques et justification

## backend : Node.js + Express

J’ai choisi **Node.js** et **Express** parce que c’est simple à utiliser et pratique pour créer une API.
Il y a beaucoup de librairies disponibles (npm), ce qui me permet d’ajouter facilement ce dont j’ai besoin (comme cookie-parser ou jsonwebtoken).

## Base de donées : MariaDB

J’ai choisi **MariaDB** car c’est une base de données fiable et gratuite, très proche de MySQL.
Elle est bien adaptée pour les relations entre les utilisateurs, les missions et les candidatures.

## Authentification : JWT

J’utilise **JWT** pour que les utilisateurs puissent se connecter.
Le token est mis dans un cookie sécurisé, ce qui évite de gérer des sessions côté serveur.

## Sécurité : Argon2

J’utilise **Argon2** pour hacher les mots de passe avant de les enregistrer.
C’est un moyen sûr de protéger les comptes des utilisateurs.

## Gestion des cookies : cookie-parser

**cookie-parser** me sert à lire et écrire facilement les cookies dans Express.
Je l’utilise pour gérer le token JWT.

## Documentation : JSDoc

J’ai choisi **JSDoc** pour pouvoir mettre des commentaires dans mon code et générer une petite documentation automatiquement.

## Gestion de projet : GitHub Projects

J’ai utilisé **GitHub Projects** avec un tableau Kanban (To Do, In Progress, Done) pour organiser mes tâches et suivre mon avancement.

## Tests : Postman

J’ai utilisé **Postman** pour tester mes routes (création d’utilisateurs, missions, candidatures) et vérifier que tout fonctionne bien avant de rendre le projet.
