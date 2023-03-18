const express = require("express");
const router = express.Router();
const firebase = require('firebase/auth');
const customerController = require("../../controllers/v1/customer.controller");
const { body, validationResult } = require("express-validator");
const advancedResults = require('../../middleware/v1/advancedResults')
const customerModel = require('../../models/v1/customer.model')
const {isAuth , authorize} = require('../../middleware/v1/auth')



router.post('/login',customerController.login)

router.get('/',isAuth,authorize('user','superAdmin'),advancedResults(customerModel),customerController.getAllCustomer)

router.get('/:id',isAuth,authorize('user','superAdmin'),advancedResults(customerModel),customerController.getCustomer)
module.exports = router