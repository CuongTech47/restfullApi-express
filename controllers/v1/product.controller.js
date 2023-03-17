const productService = require("../../serverices/v1/product.service");
const { validationResult } = require("express-validator");
const ErrorResponse = require("../../utils/errorResponse");
const Product = require("../../models/v1/product.model");
const dotenv = require('dotenv')

const path = require('path')
dotenv.config()
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
      const name = req.body.name
      const description = req.body.description
      const category = req.body.category
      const price = req.body.price
      const quantity = req.body.quantity
     
      if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
      }

      let file = req.files.imageUrl
      if(!file.mimetype.startsWith('image')){
        return next( new ErrorResponse (`Please upload an image file`,400))
      }
      if(file.size > process.env.MAX_FILE_UPLOAD){
        return next( new ErrorResponse (`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400))
      }
      file.name = `photo_${name}${path.parse(file.name).ext}`
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
        if(err) {
          return next(new ErrorResponse(`Problem with file upload`,500))
        }
      })
      const imageUrl = file.name
      
      const newProduct = {name , description , category , price , quantity ,imageUrl };
      console.log(newProduct)
      const product = await productService.addProduct(newProduct);
      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
      next();
    }
  }
  //get all product
  async getAllProduct(req, res, next) {
    try {
      // let query;

      // //copy req.query
      // const reqQuery = { ...req.query };

      // // fields to exclude

      // const removeFields = ["select", "sort" , "page", "limit"];

      // // loop over removeFields and delete them from reqQuery

      // removeFields.forEach((param) => delete reqQuery[param]);

      // // create query string
      // let queryStr = JSON.stringify(reqQuery);

      // // create openrator ($gt , $gte , etc )
      // queryStr = queryStr.replace(
      //   /\b(gt|gte|lt|lte|in)\b/g,
      //   (match) => `$${match}`
      // );

      // // find resource
      // query = Product.find(JSON.parse(queryStr));

      // //Seclect Fields
      // if (req.query.select) {
      //   const fields = req.query.select.split(",").join(" ");
      //   // console.log(fields);
      //   query = query.select(fields);
      // }

      // //sort
      // if (req.query.select) {
      //   const fields = req.query.select.split(",").join(" ");
      //   // console.log(fields);
      //   query = query.select(fields);
      // }
      // if (req.query.sort) {
      //   const sortBy = req.query.sort.split(",").join(" ");
      //   query = query.sort(sortBy);
      // } else {
      //   query = query.sort("-createdAt");
      // }
      // // pagination

      // const page = parseInt(req.query.page, 10) || 1;
      // const limit = parseInt(req.query.limit, 10) || 2;

      // const startIndex = (page - 1) * limit;
      // const endIndex = page * limit;
      // const total = await Product.countDocuments();

      // query = query.skip(startIndex).limit(limit);
      // // const page = req.query.page || 1;
      // // const limit = 10; // Số lượng sản phẩm trên mỗi trang
      // // const products = await productService.getProducts();

      // // executing query
      // const products = await query;

      // // pagination result
      // const pagination = {};

      // if (endIndex < total) {
      //   pagination.next = {
      //     page: page + 1,
      //     limit,
      //   };
      // }

      // if (startIndex > 0) {
      //   pagination.prev = {
      //     page: page - 1,
      //     limit,
      //   };
      // }

      res.status(200).json(
        res.advancedResults
        // success: true,
        // count: products.length,
        // pagination,
        // message: "Data fetched successfully",
        // data: products,
      );
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
        data: product,
      });
    } catch (err) {
      if (!err.statusCode) {
        return next(
          new ErrorResponse(
            `Product not fount with id of ${req.params.id}`,
            400
          )
        );
      }
      if (err.statusCode) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message, // chi ra moi ten
        });
      } else {
        next(err);
      }
    }
  }
  async deleteProduct(req, res, next) {
    const productId = req.params.id;
    try {
      const product = await productService.deleteProduct(productId);
      res.status(200).json({
        success: true,
        message: "Data deleted successfully",
        product: product,
      });
    } catch (err) {
      if (!err.statusCode) {
        return next(
          new ErrorResponse(
            `Product not fount with id of ${req.params.id}`,
            400
          )
        );
      }
      if (err.statusCode) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message, // chi ra moi ten
        });
      } else {
        next(err);
      }
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
      console.log(updateProductData);
      var product = await productService.updateProduct(
        productId,
        updateProductData
      );
      res.status(200).json({
        success: true,
        message: "Data updated successfully",
        data: product,
      });
    } catch (err) {
      if (!err.statusCode) {
        return next(
          new ErrorResponse(
            `Product not fount with id of ${req.params.id}`,
            400
          )
        );
      }
      if (err.statusCode) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message, // chi ra moi ten
        });
      } else {
        next(err);
      }
    }
  }

  async productPhotoUpload(req, res, next) {
    try {
      let id = req.params.id
      const product = await productService.getProductById(id);

      // console.log(product)

      if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
      }
      

      const file = req.files.file

      console.log(file)

      //make sure the image is photo

      if(!file.mimetype.startsWith('image')){
        return next( new ErrorResponse (`Please upload an image file`,400))
      }

      // check filesize

      if(file.size > process.env.MAX_FILE_UPLOAD){
        return next( new ErrorResponse (`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400))
      }
      // crate custom filename
      file.name = `photo_${product._id}${path.parse(file.name).ext}`

      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
        if(err) {
          return next(new ErrorResponse(`Problem with file upload`,500))
        }
      })
      await Product.findByIdAndUpdate(id , {imageUrl : file.name})

      res.status(200).json({
        success : true,
        data : file.name
      })
    } catch (err) {
      if (!err.statusCode) {
        // return next(
        //   new ErrorResponse(
        //     `Product not fount with id of ${req.params.id}`,
        //     400
        //   )
        // );
        next(err)
      }
      if (err.statusCode) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message, // chi ra moi ten
        });
      } else {
        next(err);
      }
      
    }
  }
}

module.exports = new ProductContrller();
