const express = require('express');
const router = express.Router();

const dishController = require('../controllers/dish.controller');

router.get('/', dishController.getDishes);

router.post('/', dishController.addNewDish);

router.get('/:id', dishController.getDishById);

router.put('/:id', dishController.updateDish);

router.delete('/:id', dishController.deleteDish);

router.get('/counter/:counterID', dishController.getDishByCounterID);

module.exports = router;