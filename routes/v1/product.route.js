const express = require("express");
const router = express.Router();
const productController = require("../../controllers/v1/product.controller");
const { body, validationResult } = require("express-validator");
// const isAuth = require('../../middleware/v1/isAuth')
const {isAuth, authorize} = require('../../middleware/v1/auth')

const advancedResults = require('../../middleware/v1/advancedResults')

const productModel = require('../../models/v1/product.model')


router.get("/", advancedResults(productModel ),productController.getAllProduct);

router.post(
  "/",isAuth,authorize('user','superAdmin'),
  [
    body("name")
      .notEmpty()
      .withMessage("Tên sản phẩm không được để trống")
      .matches(/^[A-Za-z ]+$/)
      .withMessage("Tên chỉ được chứa chữ cái và khoảng trắng"),
    body("category")
      .notEmpty()
      .withMessage("Danh mục sản phẩm không được để trống")
      .matches(/^[A-Za-z ]+$/)
      .withMessage("Danh mục chỉ được chứa chữ cái và khoảng trắng"),
      
    body("description")
      .notEmpty()
      .withMessage("Mô tả sản phẩm không được để trống"),
    // body('price').notEmpty().withMessage('Giá sản phẩm không được để trống').isNumeric().withMessage('Giá sản phẩm phải là số'),
    // body("imageUrl")
    //   .notEmpty()
    //   .withMessage("Đường dẫn hình ảnh không được để trống"),
    body("quantity")
      .notEmpty()
      .withMessage("Số lượng sản phẩm không được để trống")
      .isNumeric()
      .withMessage("Giá sản phẩm phải là số")
      .isInt({ min: 0 })
      .withMessage(
        "Số lượng sản phẩm phải là một số nguyên lớn hơn hoặc bằng 0"
      ),
    body("price")
      .notEmpty()
      .withMessage("Giá sản phẩm không được để trống")
      .isNumeric()
      .withMessage("Giá sản phẩm phải là số")
      .custom((value, { req }) => {
        if (value <= 0) {
          throw new Error("Giá sản phẩm phải lớn hơn 0");
        }
        return true;
      }),
  ],

  productController.addProduct
)

router.get('/:id',isAuth,authorize('user','superAdmin'),productController.getproduct)
router.delete('/:id',isAuth,authorize('user','superAdmin'),productController.deleteProduct)

router.put('/:id',isAuth,authorize('user','superAdmin'),[
  body("name")
      .notEmpty()
      .withMessage("Tên sản phẩm không được để trống")
      .matches(/^[A-Za-z ]+$/)
      .withMessage("Tên chỉ được chứa chữ cái và khoảng trắng"),
    body("category")
      .notEmpty()
      .withMessage("Danh mục sản phẩm không được để trống")
      .matches(/^[A-Za-z ]+$/)
      .withMessage("Danh mục chỉ được chứa chữ cái và khoảng trắng"),
      
    body("description")
      .notEmpty()
      .withMessage("Mô tả sản phẩm không được để trống"),
    // body('price').notEmpty().withMessage('Giá sản phẩm không được để trống').isNumeric().withMessage('Giá sản phẩm phải là số'),
    body("imageUrl")
      .notEmpty()
      .withMessage("Đường dẫn hình ảnh không được để trống"),
    body("quantity")
      .notEmpty()
      .withMessage("Số lượng sản phẩm không được để trống")
      .isNumeric()
      .withMessage("Giá sản phẩm phải là số")
      .isInt({ min: 0 })
      .withMessage(
        "Số lượng sản phẩm phải là một số nguyên lớn hơn hoặc bằng 0"
      ),
    body("price")
      .notEmpty()
      .withMessage("Giá sản phẩm không được để trống")
      .isNumeric()
      .withMessage("Giá sản phẩm phải là số")
      .custom((value, { req }) => {
        if (value <= 0) {
          throw new Error("Giá sản phẩm phải lớn hơn 0");
        }
        return true;
      }),

],productController.updateProduct)

router.put('/photo/:id',isAuth , authorize('superAdmin','user'),productController.productPhotoUpload)




module.exports = router;
