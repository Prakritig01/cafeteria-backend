const Counter = require('./../models/counter.model');

const getAllcounters = async (req,res) =>{
    const counters = await Counter.find().populate('merchant');
    res.json({"counters":counters});
}

const addNewCounter = async (req,res) => {
    const counter = new Counter(req.body);
    await counter.save();
    res.json({"message":"Counter added successfully" , "counter":counter});
}

const getCounterById = async (req,res) => {
    const counter = await Counter.findById(req.params.id).populate('merchant');
    res.json({"counter":counter});
}

const updateCounterById = async (req,res) => {
    const counter = await Counter.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true}).populate('merchant');
    res.json({"message":"Counter updated successfully","counter":counter});
}

const deleteCounterById = async (req,res) => {
    const counter = await Counter.findByIdAndDelete(req.params.id);
    res.json({"message":"Counter deleted successfully","counter":counter});
}



module.exports = {getAllcounters,addNewCounter,getCounterById,updateCounterById,deleteCounterById};