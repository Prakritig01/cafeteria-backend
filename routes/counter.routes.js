const express = require('express');
const router = express.Router();
const { ROLE } = require('./../constants');
const {checkRole, authCounter} = require('../middleware/permissions');

const counterController = require('../controllers/counter.controller');

router.get('/',counterController.getAllcounters);

router.get('/merchant/:merchantID',checkRole(ROLE.Merchant),counterController.getCounterByMerchantId);

router.use(checkRole(ROLE.Admin));

router.post('/',counterController.addNewCounter);

router.get('/:id',counterController.getCounterById);

router.patch('/:id',counterController.updateCounterById);

router.delete('/:id',counterController.deleteCounterById);




module.exports = router;
