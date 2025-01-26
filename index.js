require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
require('./connection/connectDB');

const userRoutes = require('./routes/user.routes');
const cartRoutes = require('./routes/cart.routes');
const counterRoutes = require('./routes/counter.routes');
const dishRoutes = require('./routes/dish.routes');

app.get('/' , (req , res) => {
    res.send("Hello ");
});

app.use('/users',userRoutes);
app.use('/cart',cartRoutes);
app.use('/counter',counterRoutes);
app.use('/dishes',dishRoutes);



app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})
