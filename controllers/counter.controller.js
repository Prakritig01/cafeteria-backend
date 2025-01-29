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

const getCounterByMerchantId = async (req,res) => {
    const {merchantID} = req.params;
    // console.log("merchnatID",merchantID);
    try{
        const counter = await Counter.find({merchant : merchantID});

        res.json({"counter":counter});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:'Error fetching counter',error:err.message});
    }
};



module.exports = {getAllcounters,addNewCounter,getCounterById,updateCounterById,deleteCounterById,getCounterByMerchantId};