var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authentification.middleware');
// import controller for index
const indexController = require('../controllers/indexController');

router.get('/', indexController.home);

module.exports = router;
