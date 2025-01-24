const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    dish : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
        validate : {
            validator : async (dishId)=>{
                const dish = await mongoose.model('Dish').exists({_id: dishId});
                if(!dish){
                    return false;
                }
                return true;
            },
            message : 'Dish not found'
        }
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'customer',
        enum: ['customer', 'admin','merchant']
    },
    cart :{
        type: [cartSchema]
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;