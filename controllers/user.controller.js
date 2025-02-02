const User = require('./../models/user.model');
const Counter = require('./../models/counter.model');

const getAllUsers = async (req, res) => {
    try {
        // console.log("req.user",req.user);
        const { role } = req.query; // Extract role from query parameters
        let query = {}; 

        if (role) {
            query.role = role; // Apply role filter only if provided
        }

        const users = await User.find(query).select('-cart');
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
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
        const { id } = req.params;
        const { role, password } = req.body; // Extract role and password from the request body

        // console.log("id from update user", id);
        // console.log("role", role);

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("user", user);

        // Check if the role is being changed from 'merchant' to something else
        if (user.role === "merchant" && role !== "merchant") {
            // Find counters where this user is assigned as a merchant
            const counters = await Counter.find({ merchant: id });

            // Check if any counter has only one merchant
            const orphanedCounter = counters.some(counter => counter.merchant.length === 1);

            if (orphanedCounter) {
                return res.status(400).json({
                    message: "Cannot change role. This merchant is the only one assigned to a counter, which would be orphaned."
                });
            }
        }

        // Proceed with updating the user
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        res.status(400).json({ message: "Error updating user", error });
    }
};



const deleteUser = async(req,res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ "message" : "User deleted successfully", "user" : user});
}

const deleteItemFromCart = async(req,res) => {
    
}


module.exports = { getAllUsers, addUser, getUserById, updateUser, deleteUser };


