const productService = require("../../serverices/v1/product.service");
const { validationResult } = require("express-validator");
class ProductContrller {
  //post product
  async addProduct(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // const error = new Error('Validation failed , entered data is incorrect')
      // error.statusCode = 422
      // throw error

      const error = errors.array().map((error) => error.msg);
      // throw error
      return res.status(422).json({
        success: false,
        message: error, // chi ra moi ten
      });
    }
    try {
      const newProduct = req.body;
      const product = await productService.addProduct(newProduct);
      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  //get all product
  async getAllProduct(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = 10; // Số lượng sản phẩm trên mỗi trang
      const products = await productService.getProducts(page, limit);

      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        products,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
      next(err);
    }
    // message: 'Thêm sản phẩm thành công')
  }
  //get a product
  async getproduct(req, res, next) {
    const productId = req.params.id;
    try {
      const product = await productService.getProductById(productId);
      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        product: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Không tìm thấy Id Product",
      });
    }
  }
  async deleteProduct(req, res, next) {
    const productId = req.params.id;
    try {
      const product = await productService.deleteProduct(productId);
      res.status(201).json({
        success: true,
        message: "Data deleted successfully",
        product: product,
      });
    } catch (err) {
      // console.log(err)
      // console.log(err.message)
      res.status(500).json({
        success: false,
        message: err.message,
      });
      next();
    }
  }
  async updateProduct(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // const error = new Error('Validation failed , entered data is incorrect')
      // error.statusCode = 422
      // throw error

      const error = errors.array().map((error) => error.msg);
      return res.status(422).json({
        success: false,
        message: error, // chi ra moi ten
      });
    }
    try {
      var productId = req.params.id;
      var updateProductData = req.body;
      console.log(updateProductData)
      var product = await productService.updateProduct(
        productId,
        updateProductData
      )
      res.status(201).json({
        success : true,
        message : "Data updated successfully",
        product
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        success: false,
        message: err.message,
      });
      
    }
    next();
  }
}

module.exports = new ProductContrller();
