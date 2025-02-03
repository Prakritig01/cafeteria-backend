const express = require('express');
const router = express.Router();
const User = require('./../models/user.model');

const cartController = require('./../controllers/cart.controller');

router.get('/',cartController.getCartItems);

router.post('/',cartController.addDishToCart);

router.patch('/:id',cartController.updateItemQuantityInCart);

router.delete('/:id',cartController.deleteDishFromCart);

router.delete('/',cartController.clearCart);



module.exports = router;