const express = require('express');
const router = express.Router();
const { ROLE } = require('./../constants');
const {checkRole} = require('../middleware/permissions');

const dishController = require('../controllers/dish.controller');

router.get('/', dishController.getDishes);

router.get('/counter/:counterID', dishController.getDishByCounterID);

router.use(checkRole(ROLE.Merchant));

router.post('/', dishController.addNewDish);

router.get('/:id', dishController.getDishById);

router.put('/:id', dishController.updateDish);

router.delete('/:id', dishController.deleteDish);


module.exports = router;