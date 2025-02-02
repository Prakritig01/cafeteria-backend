const express = require('express');
const router = express.Router();
const User = require('./../models/user.model');
const { ROLE } = require('./../constants');
const { checkRole } = require('../middleware/permissions');

const userController = require('./../controllers/user.controller');


router.use(checkRole(ROLE.Admin));

router.get('/',userController.getAllUsers);

router.post('/',userController.addUser);

router.get('/:id', userController.getUserById);

router.patch('/:id' ,userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;