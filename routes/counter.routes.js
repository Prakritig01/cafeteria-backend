const express = require('express');
const router = express.Router();

const counterController = require('../controllers/counter.controller');

router.get('/',counterController.getAllcounters);

router.post('/',counterController.addNewCounter);

router.get('/:id',counterController.getCounterById);

router.patch('/:id',counterController.updateCounterById);

router.delete('/:id',counterController.deleteCounterById);

module.exports = router;
