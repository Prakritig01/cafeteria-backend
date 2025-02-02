const express = require('express');
const router = express.Router();
const User = require('./../models/user.model');

const userController = require('./../controllers/user.controller');

router.get('/',userController.getAllUsers);

router.post('/',userController.addUser);

router.get('/:id', userController.getUserById);

router.patch('/:id' ,userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;