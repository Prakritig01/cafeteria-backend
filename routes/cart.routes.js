const express = require('express');
const router = express.Router();
const User = require('./../models/user.model');

const cartController = require('./../controllers/cart.controller');

router.use(auth);

router.get('/',cartController.getCartItems);

router.post('/',cartController.addDish);

router.patch('/:id',cartController.updateItemQuantityInCart);

router.delete('/:id',cartController.deleteDishFromCart);

router.delete('/',cartController.clearCart);

async function auth(req,res,next) {
    const id = '6793809bbe563f3ed9b1b9ee'
    req.user = await User.findById(id);
    next();
}

module.exports = router;