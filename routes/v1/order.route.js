const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/v1/order.controller");
const { body, validationResult } = require("express-validator");

const {isAuth, authorize} = require('../../middleware/v1/auth')

const advancedResults = require('../../middleware/v1/advancedResults')

const orderModel = require('../../models/v1/order.model')



router.post('/',orderController.addOrder)
// router.get("/", advancedResults(productModel ),productController.getAllProduct);

// router.post('')

// router.get('/:id',isAuth,authorize('user','superAdmin'),productController.getproduct)
// router.delete('/:id',isAuth,authorize('user','superAdmin'),productController.deleteProduct)



// router.put('/photo/:id',isAuth , authorize('superAdmin','user'),productController.productPhotoUpload)




module.exports = router;
