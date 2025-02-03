const User = require("./../models/user.model");
const Dish = require("./../models/dish.model");

const getCartItems = async (req, res) => {
  //also send user
  try {
    // Fetch user from the database and populate cart items
    const user = await User.findById(req.user.id).populate("cart.dish");

    // Filter out any null dishes (if some are deleted)
    const cart = user.cart.filter((item) => item.dish !== null);

    if (user.cart.length != cart.length) {
      user.cart = cart;
      await user.save();
    }

    // console.log("Cart after populating:", cart);
    res.json({ user: user, cart: cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const addDishToCart = async (req, res) => {
  try {
    const { dish } = req.body;

    if (!dish || !dish._id) {
      return res.status(400).json({ msg: "Dish ID is required" });
    }

    // Fetch the user from the database (ensures it's a Mongoose document)
    const user = await User.findById(req.user.id).populate("cart.dish");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the dish exists in the database.
    const existingDish = await Dish.findById(dish._id);
    if (!existingDish) {
      return res
        .status(404)
        .json({ msg: `Dish with ID ${dish._id} not found` });
    }

    if (!existingDish.inStock) {
      return res.status(400).json({ msg: "Dish is currently out of stock" });
    }

    // Find existing cart item in user's cart.
    const cartItem = user.cart.find(
      (item) => item.dish._id.toString() === existingDish._id.toString()
    );

    if (cartItem) {
      if (cartItem.quantity >= 10) {
        return res.status(400).json({ msg: "Maximum quantity reached" });
      }
      cartItem.quantity += 1;
    } else {
      user.cart.push({ dish: existingDish, quantity: 1 });
    }

    // Save the updated user cart to the database.
    await user.save();

    // Populate the cart again to include dish details.
    await user.populate("cart.dish");

    res.json({
      message: "Dish added successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const updateItemQuantityInCart = async (req, res) => {
  try {
    // Find the item in the cart

    const user = await User.findById(req.user.id);
    const itemInCart = user.cart.find(
      (item) => item.dish._id.toString() === req.params.id
    );

    // console.log('itemInCart',itemInCart);
    if (!itemInCart) {
      return res
        .status(404)
        .json({ msg: `Item with id ${req.params.id} not found in cart` });
    }

    const changedQuantity = Number(req.body.increment) || 0;

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
      user.cart = user.cart.filter(
        (item) => item.dish._id.toString() !== req.params.id
      );
      await user.save();
      await user.populate("cart.dish");
      return res.json({ msg: "Dish removed from cart", cart: user.cart });
    }

    // Update the quantity
    itemInCart.quantity += changedQuantity;

    // Save the updated user data and populate cart
    await user.save();
    await user.populate("cart.dish");

    res.json({ msg: "Dish quantity updated successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message || "An error occurred" });
  }
};

const deleteDishFromCart = async (req, res) => {
  try {
    // Find the user first
    const user = await User.findById(req.user.id).populate("cart.dish"); // Populate cart with dish details
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the dish exists in the cart
    const dishExists = user.cart.some(
      (item) => item.dish._id.toString() === req.params.id
    );

    if (!dishExists) {
      return res.status(404).json({ msg: "Dish not found in the cart" });
    }

    // Remove the dish from the cart
    user.cart = user.cart.filter(
      (item) => item.dish._id.toString() !== req.params.id
    );

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Dish deleted from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({ "Cart cleared successfully": user.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getCartItems,
  addDishToCart,
  deleteDishFromCart,
  clearCart,
  updateItemQuantityInCart,
};
