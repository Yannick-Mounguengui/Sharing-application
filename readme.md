# Projet : application de partage

## Membres du binôme :

* Yannick MOUNGUENGUI

## How To

## Récupérer le projet

*Dans un terminal faire les commandes suivantes:*

```bash
git clone https://github.com/yannick-itoua/Sharing-application.git.git

```
*se placer dans le répertoire*

```bash
cd Sharing-application
```
*creer le dossier dbData*

```bash
mkdir dbData
```
*faire la commande suivante pour generer les modules:*

```bash
npm install
```
*faire la commande suivante pour lancer le serveur mongoDB:*

```bash
mongod --dbpath dbData
```
*ouvrir un autre terminal et se placer dans mounguengui_yannick_jsfs/Application de partage puis faire la commande suivante pour importter une liste d'objets si on le veut:*

```bash
mongoimport --db appBase --collection items --file ./misc/items.json
```
*ensuite faire la commande:*

```bash
nodemon
```

*Enfin ouvrir un navigateur et coller le lien suivant:*

```bash
http://localhost:3000/
```

*NB:Il est recommandé que si on veut verifié les fonctionnalités avec plusieurs utilisateurs connectés,d'utiliser des navigateurs differents pour eviter un probleme de token.La durée de vie du token a été augmente jusqu'à 10min*
## Info projet

# API côté serveur

Voici une explication détaillée des différentes routes  :

shareRouter: est un router qui permet de gérer les requêtes pour la page "share". Ce router est défini dans le fichier "routes/share.js".On a ainsi:

  / : cette route permet d'afficher la page de partage de l'application en utilisant la méthode HTTP GET en appelant le contrôleur shareController.sendHTMLfile

userRouter: est un router qui permet de gérer les requêtes pour les utilisateurs. Ce router est défini dans le fichier "routes/user.js".On a ainsi:

  /me : cette route permet d'afficher les informations de l'utilisateur connecté en utilisant la méthode HTTP GET en appelant le contrôleur userController.me.

accessRouter: est un router qui permet de gérer les requêtes pour l'accès à certaines ressources ou pages, comme la page de connexion ou d'inscription. Ce router est défini dans le fichier "routes/access.js".On a ainsi:

  /login : cette route permet d'afficher le formulaire de connexion à l'aide de la méthode HTTP GET. Lorsque l'utilisateur soumet le formulaire de connexion, les informations sont envoyées avec la méthode HTTP POST et la route /login permet de traiter les informations de connexion avec la méthode HTTP POST en appelant le contrôleur accessController.login.

  /register  : cette route permet d'afficher le formulaire d'inscription à l'aide de la méthode HTTP GET. Lorsque l'utilisateur soumet le formulaire d'inscription, les informations sont envoyées avec la méthode HTTP POST et la route /register permet de traiter les informations d'inscription avec la méthode HTTP POST en appelant le contrôleur accessController.register.

  /logout  : cette route permet à l'utilisateur de se déconnecter de l'application en appelant le contrôleur accessController.logout.

itemRouter: est un router qui permet de gérer les requêtes pour les articles ou les produits. Ce router est défini dans le fichier "routes/item.js".On a ainsi:

  / : cette route permet d'afficher tous les articles dans l'application en utilisant la méthode HTTP GET en appelant le contrôleur itemController.allitems.

  /others  : cette route permet d'afficher les articles des autres utilisateurs en utilisant la méthode HTTP GET en appelant le contrôleur itemController.getItemsOfOther.

  /  : cette route permet à l'utilisateur de créer un nouvel article en utilisant la méthode HTTP POST en appelant le contrôleur itemController.createitems.

  /:id  : cette route permet à l'utilisateur de supprimer un article en utilisant la méthode HTTP DELETE en appelant le contrôleur itemController.deleteitems.

  /borrow/:itemId  : cette route permet à l'utilisateur d'emprunter un article en utilisant la méthode HTTP PUT en appelant le contrôleur itemController.borrowItem.

  /release/:itemId  : cette route permet à l'utilisateur de rendre un article emprunté en utilisant la méthode HTTP PUT en appelant le contrôleur itemController.releaseItem.

  /update/:itemId  : cette route permet à l'utilisateur de mettre à jour la description d'un article en utilisant la méthode HTTP PUT en appelant le contrôleur itemController.updateItemDescription.

error: est un middleware qui gère les erreurs qui peuvent survenir lors du traitement des requêtes. Il est défini dans le fichier "routes/error.js".

/access: correspond au router "accessRouter" et n'est pas soumis au middleware "authMiddleware.validToken", ce qui signifie qu'il n'est pas protégé par une authentification.

/*: correspond au router "shareRouter" et permet de gérer toutes les autres requêtes.

Enfin, toutes ces routes sont protégées par le middleware authMiddleware.validToken qui vérifie si l'utilisateur est authentifié avant de lui permettre d'accéder aux différentes fonctionnalités de l'application.

# Application de partage
L'application de partage est une application qui permet la creation,suppression,l'emprunt et liberation d'objet par differents utilisateurs connectés à l'aide de differents boutons.
Lorsqu'un objet est emprunté cela s'affiche du coté des autres utilisateurs que tel objet est emprunté par tel utilisateur.
Chaque utilisateur a une capacité d'emprunté limité à 2 objets maximums.
Pour avoir les effets de changement effectué par chaque utilisateur il faut actualiser la page de chaque utilisateur(exemple si l'user A a ajouté un objet,l'user B doit actualiser sa page).
Pour faire tous cela,l'utilisateur doit se creer un compte et se connecter à la page correspondante evidemment.

# Ameliorations possibles
Les differentes ameliorations effectués dans l'application sont:

-permettre la modification de la description d'un objet, après sa création
Pour cela j'ai créé un bouton ```Modifier``` qui me permet à chaque clique dessus de modifier la description de l'objet pour mettre à jour cela dans ma base de donnée en creant une nouvelle constante dans mon itemController qui gere la mise à jour du nom de l'objet.Puis dans le cote client,dans une nouvelle fonction je fais un fetch vers route relié à la constante de l'itemController pour appliquer cet effet via le bouton modifier.

-n'autoriser la suppression d'un objet que par l'utilisateur qui l'a initialement ajouté
Pour cela j'ai ajouté une condition à ma constante qui permet la suppresion d'objet dans mon itemController qui est:
```
if (!(item.userId == req.userId)) {
  res.status(403).json({ error: 'You can only delete objects that you have added' });
  return;
}
```

-faire en sorte que chaque fois qu'un objet est emprunté/libéré/supprimé, les autres utilisateurs connectés en soient informés en temps reel ce qui se traduit par la mise à jour des informations affichés pour ces autres utilisateurs
Pour cela j'ai ajouté la fonctionnalité socket.io au serveur mongoDB actuel,créer une classe IOController qui permettra d'informer tous les utilisateurs connectés de chaque modification sur l'application en recevant/envoyant des messages du/au coté client.

*NB*:
Concernant l'amelioration affichage des objets empruntés par d'autres utilisateurs avec socket.io,il y a un bug qui fait en sorte que ca affiche l'objet emprunté par l'utilisateur dans sa page de connexion dans la partie "Déja emprunté par d'autres".Surement que cette fonctionnalité est mal faite en la placant au mauvais endroit.
