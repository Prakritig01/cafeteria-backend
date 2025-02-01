const Dishes = require('../models/dish.model');
const { clearCart } = require('./cart.controller');

// Get all dishes
const getDishes = async (req, res) => {
    try {
        const dishes = await Dishes.find().populate('counter');
        res.json({ "dishes": dishes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dishes', error: err.message });
    }
};

// Add a new dish
const addNewDish = async (req, res) => {
    try {
        const dish = new Dishes(req.body);
        await dish.save();
        console.log("dish", dish);
        res.json({ "message": "Dish added successfully", "dish": dish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding dish', error: err.message });
    }
};

// Get a dish by ID
const getDishById = async (req, res) => {
    try {
        const dish = await Dishes.findById(req.params.id).populate('counter');
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.json({ "dish": dish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dish', error: err.message });
    }
};

// Update a dish by ID
const updateDish = async (req, res) => {
    try {
        const dish = await Dishes.findByIdAndUpdate(req.params.id, req.body, { new: true ,runValidators:true}).populate('counter');
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.json({ "message": "Dish updated successfully", "dish": dish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating dish', error: err.message });
    }
};

// Delete a dish by ID
const deleteDish = async (req, res) => {
    try {
        const dish = await Dishes.findByIdAndDelete(req.params.id);
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.json({ "message": "Dish deleted successfully", "dish": dish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting dish', error: err.message });
    }
};

// Get dishes by counter ID
const getDishByCounterID = async (req, res) => {
    // console.log(req.params);
    const { counterID } = req.params;
    // console.log(counterID);

    try {
        // Find dishes that match the counterId
        const dishes = await Dishes.find({ counter: counterID }).populate('counter');

        // console.log("dishes", dishes);

        
        res.json({ "dishes": dishes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dishes by counter', error: err.message });
    }
};

module.exports = { getDishes, addNewDish, getDishById, updateDish, deleteDish, getDishByCounterID };
