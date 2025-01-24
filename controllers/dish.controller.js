const Dishes = require('../models/dish.model');

const getDishes = async(req,res) => {
    const dishes  = await Dishes.find().populate('counter');
    res.json({"dishes": dishes});
};

const addNewDish = async (req,res) => {
    const dish = new Dishes(req.body);
    await dish.save();
    res.json({"message": "Dish added successfully", "dish": dish});
}

const getDishById = async (req,res) => {
    const dish = await Dishes.findById(req.params.id).populate('counter');
    res.json({"dish": dish});
}

const updateDish = async (req,res) => {
    const dish = await Dishes.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('counter');      
    res.json({"message": "Dish updated successfully", "dish": dish});
}

const deleteDish = async (req,res) => {
    const dish = await Dishes.findByIdAndDelete(req.params.id);
    res.json({"message": "Dish deleted successfully", "dish": dish});   
}


module.exports = {getDishes,addNewDish,getDishById,updateDish,deleteDish};