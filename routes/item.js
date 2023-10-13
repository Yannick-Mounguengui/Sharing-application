const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentification.middleware');
const itemController = require('../controllers/itemController');

router.get('/',authMiddleware.validToken, itemController.allitems);
router.get('/others',authMiddleware.validToken, itemController.getItemsOfOther);
router.post('/',authMiddleware.validToken, itemController.createitems);
router.delete('/:id',authMiddleware.validToken,itemController.deleteitems);
router.put('/borrow/:itemId',authMiddleware.validToken, itemController.borrowItem);
router.put('/release/:itemId',authMiddleware.validToken,itemController.releaseItem);
router.put('/update/:itemId',authMiddleware.validToken, itemController.updateItemDescription);
module.exports = router;
