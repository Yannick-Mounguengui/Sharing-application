var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authMiddleware = require('./middlewares/authentification.middleware');

const shareRouter = require('./routes/share');
const userRouter = require('./routes/user');
const accessRouter = require('./routes/access');
const itemRouter = require('./routes/item');
const error = require('./routes/error');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// route statique "publique"  avec login.html et register.html
app.use(express.static(path.join(__dirname, 'public')));

// ce routeur n'est pas soumis à contrôle d'accès
app.use('/access', accessRouter);

// on ajoute le middleware de contrôle : tout ce qui suit est soumis à login
app.use(authMiddleware.validToken);

// seconde route statique mais protégée par validToken ici on met share-app.html
app.use(express.static(path.join(__dirname, 'protected_public')));
// les routeurs (contrôlés)
app.use('/user', userRouter);
app.use('/item', itemRouter);
app.use('/*', shareRouter);
app.use(error);
module.exports = app;
