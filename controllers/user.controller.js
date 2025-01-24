const User = require('./../models/user.model');

const getAllUsers = async(req,res)=>{
    const users = await User.find().select('-cart');
    res.json({ "users" : users});
};

const addUser = async(req,res)=>{
    const user = await User.create(req.body);
    res.json({ "message" : "User created successfully", "user" : user});
}

const getUserById = async (req, res) => {
    try {
        // console.log(req.params.id);
        const user = await User.findById(req.params.id).select('-cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Enables validation
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error });
    }
};

const deleteUser = async(req,res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ "message" : "User deleted successfully", "user" : user});
}

module.exports = {getAllUsers,addUser,getUserById,updateUser,deleteUser};