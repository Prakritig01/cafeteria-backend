require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

require('./conn-config/conn');

app.get('/' , (req , res) => {
    res.send("Hello ");
});


app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})
