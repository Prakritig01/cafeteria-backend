const User = require('./../models/user.model');

const getCartItems = async(req,res) => {
    const cart = req.user.cart;
    res.json({"cart" : cart});
}

const addDish = async (req,res) => {
    req.user.cart.push({dish : req.body.dish , quantity : 1});
    const cart = req.user.cart;
    await req.user.save();
    res.json({"Dish added successfully" : cart});
}

const updateDish = async (req,res) => {
    const item = req.user.cart.findById(req.params.dishId);
    item.quantity += req.body.changeQuantity;
    const cart = req.user.cart;
    await req.user.save();
    res.json({"Dish quantity updated successfully" : cart});
}

const deleteDish = async (req,res) => {
    const item = req.user.cart.findByIdAndDelete(req.params.dishId);
    const cart = req.user.cart;
    await req.user.save();
    res.json({"Dish deleted successfully" : cart});
}

const clearCart = async (req,res) =>{
    req.user.cart = [];
    await req.user.save();
    res.json({"Cart cleared successfully" : req.user.cart});
}


module.exports = {getCartItems,addDish,updateDish,deleteDish,clearCart};