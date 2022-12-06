const express = require('express');
const router = express.Router();


const user = require('./user');
const dashboard = require('./dashboard');
const customer = require('./customer');
const meeting = require('./meeting');


router.use('/user', user);
router.use('/dashboard', dashboard);
router.use('/customer', customer);
router.use('/meeting', meeting);


module.exports = router;