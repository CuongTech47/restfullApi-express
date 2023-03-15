const express = require("express");
const router = express.Router();

const customerController = require("../../controllers/v1/customer.controller");
const { body, validationResult } = require("express-validator");

const {isAuth , authorize} = require('../../middleware/v1/auth')

router.post('/signup', [
    // fullName validation
    body('fullName', 'Họ tên không được để trống và chỉ bao gồm chữ cái')
      .notEmpty()
      .matches(/^[A-Za-z ]+$/),
  
    // email validation
    body('email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .custom((value , {req})=>{
        // 
        return authService.getUserFindByEmailSignUp(value)
       
    })
    
    .normalizeEmail(),
    // password validation
    body('password', 'Mật khẩu phải chứa ít nhất 6 kí tự, 1 chữ viết hoa, 1 số và 1 kí tự đặc biệt')
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
  
    // phone validation
    body('phone', 'Số điện thoại không đúng định dạng')
      .isMobilePhone('vi-VN'),
  
    // address validation
    body('address', 'Địa chỉ không được để trống')
      .notEmpty(),
],
authController.signUp)

router.post('/login',[
    body('email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .custom((value , {req})=>{
        // 
        return authService.getUserFindByEmailSignIn(value)
       
    })
    .normalizeEmail(),
    // password validation
    body('password', 'Mật khẩu phải chứa ít nhất 6 kí tự, 1 chữ viết hoa, 1 số và 1 kí tự đặc biệt')
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),

],authController.signIn)

router.get('/me',isAuth,authController.getMe)




module.exports = router