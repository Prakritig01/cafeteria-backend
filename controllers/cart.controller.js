const User = require("./../models/user.model");
const Dish = require('./../models/dish.model');

const getCartItems = async (req, res) => {
  try {
    await req.user.populate('cart.dish')
    const cart = req.user.cart;
    res.json({ cart: cart, user : req.user });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const addDish = async (req, res) => {
  try {
    const { dish } = req.body; // Extract the dish object from the request body.

    // Validate if dish ID is present.
    if (!dish || !dish._id) {
      return res.status(400).json({ msg: "Dish ID is required" });
    }

    // Check if the dish exists in the database.
    const existingDish = await Dish.findById(dish._id); // Corrected method name (`findById`).
    if (!existingDish) {
      return res
        .status(404)
        .json({ msg: `Dish with ID ${dish._id} not found` });
    }

    // Check if the dish is in stock.
    if (!existingDish.inStock) {
      return res.status(400).json({ msg: "Dish is currently out of stock" });
    }

    // Find existing cart item in user's cart.
    const cartItem = req.user.cart.find(
      (item) => item.dish.toString() === existingDish._id.toString()
    );

    if (cartItem) {
      // Check if the quantity limit is reached.
      if (cartItem.quantity >= 10) {
        return res.status(400).json({ msg: "Maximum quantity reached" });
      }
      // Increment the quantity of the existing item.
      cartItem.quantity += 1;
    } else {
      // Add new dish to the cart with quantity 1.
      req.user.cart.push({
        dish: existingDish._id,
        quantity: 1,
      });
    }

    // Save the updated user cart to the database.
    await req.user.save();

    // Populate the cart items to include dish details.
    await req.user.populate("cart.dish");

    // Respond with the updated cart.
    res.json({
      message: "Dish added successfully",
      cart: req.user.cart,
    });
  } catch (error) {
    // Catch any errors and respond with an error message.
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};


const updateDishInCart = async (req, res) => {
  try {
    const dishItem = req.user.cart.find(
      (item) => item.dish._id.toString() === req.params.dishId
    );
    const changedQuantity = req.body.changedQuantity || 0;

    if (!dishItem) {
      return res
        .status(404)
        .json({ msg: `Dish with id ${req.params.dishId} not found in cart` });
    }

    dishItem.quantity += changedQuantity;

    const cart = req.user.cart;
    await req.user.save();

    res.json({ "Dish updated successfully": cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteDishFromCart = async (req, res) => {
  try {
    const updatedCart = req.user.cart.filter(
      (item) => item.dish._id.toString() !== req.params.dishId
    );

    req.user.cart = updatedCart;
    await req.user.save();

    res
      .status(200)
      .json({ message: "Dish deleted successfully", cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    req.user.cart = [];
    await req.user.save();
    res.json({ "Cart cleared successfully": req.user.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getCartItems,
  addDish,
  deleteDishFromCart,
  clearCart,
  updateDishInCart,
};
