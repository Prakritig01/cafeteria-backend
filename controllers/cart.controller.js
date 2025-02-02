const User = require("./../models/user.model");
const Dish = require('./../models/dish.model');

const getCartItems = async (req, res) => {
  try {
    // console.log('req.user in fetch cart',req.user);
    await req.user.populate('cart.dish')
    const cart = req.user.cart.filter(item => item.dish !== null);
    res.json({ cart: cart});
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const addDish = async (req, res) => {
  try {
    const { dish } = req.body; // Extract the dish object from the request body.
    // console.log('dish from body',dish);

    // Validate if dish ID is present.
    if (!dish || !dish._id) {
      return res.status(400).json({ msg: "Dish ID is required" });
    }

    // Check if the dish exists in the database.
    const existingDish = await Dish.findById(dish._id); // Corrected method name (`findById`).
    // console.log('existingDish',existingDish);
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


const updateItemQuantityInCart = async (req, res) => {
  try {
    // Find the item in the cart
   
    const itemInCart = req.user.cart.find(
      (item) => item.dish._id.toString() === req.params.id
    );

    // console.log('itemInCart',itemInCart);
    if (!itemInCart) {
      return res
        .status(404)
        .json({ msg: `Item with id ${req.params.id} not found in cart` });
    }

    const changedQuantity = Number(req.body.increment) || 0;
    // console.log('changedQuantity',changedQuantity);

    // Ensure the increment is a valid number
    if (isNaN(changedQuantity)) {
      return res.status(400).json({ msg: "Invalid increment value" });
    }

    // Ensure the quantity doesn't go negative
    if (itemInCart.quantity + changedQuantity < 0) {
      return res.status(400).json({
        msg: "Quantity cannot be less than 0",
      });
    }

    // remove item if quantity is 0
    if (itemInCart.quantity + changedQuantity === 0) {
      req.user.cart = req.user.cart.filter(
        (item) => item.dish._id.toString() !== req.params.id
      );
      await req.user.save();
      await req.user.populate('cart.dish')
      return res.json({ msg: "Dish removed from cart", cart: req.user.cart });
    }

    // Update the quantity
    itemInCart.quantity += changedQuantity;

    // Save the updated user data and populate cart
    await req.user.save();
    await req.user.populate('cart.dish')

    res.json({ msg: "Dish quantity updated successfully", cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message || "An error occurred" });
  }
};

const deleteDishFromCart = async (req, res) => {
  try {
    // console.log('req.params.id',req.params.id);
    const dishExists = req.user.cart.some(
      (item) => item.dish._id.toString() === req.params.id
    );

    if (!dishExists) {
      return res.status(404).json({ msg: "Dish not found in the cart" });
    }

    const updatedCart = req.user.cart.filter(
      (item) => item.dish._id.toString() !== req.params.id
    );

    req.user.cart = updatedCart;
    await req.user.save();

    res
      .status(200)
      .json({ message: "Dish deleted from cart successfully", cart: req.user.cart });
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
  updateItemQuantityInCart
};
