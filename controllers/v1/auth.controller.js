const userService = require("../../serverices/v1/user.service");
const authService = require("../../serverices/v1/auth.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const ErrorResponse = require("../../utils/errorResponse");
const dotenv = require("dotenv");
const userModel = require("../../models/v1/user.model");
const sendEmail = require("../../utils/sendEmail");

const crypto = require("crypto");
dotenv.config();
class AuthControler {
  async signUp(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array().map((error) => error.msg);
      return res.status(422).json({
        //  errors: errors.array()
        success: false,
        message: error, // chi ra moi ten
      });
    }
    try {
      const { email, fullName, phone, address, password } = req.body;

      const user = await userModel.findOne({ email: email });

      //check user
      if (user) {
        return next(new ErrorResponse("Email đã tồn tại!", 400));
      }

      const newUser = await userModel.create({
        email,
        fullName,
        phone,
        address,
        password,
      });

      // const user = await userService.addUser(newUser);

      res.status(201).json({
        success: true,
        message: "Thêm User thành công",

        userId: newUser._id,
      });
    } catch (err) {
      if (!err.statusCode) {
        next(err);
      } else {
        res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
    }
  }
  async signIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // validate email vs password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array().map((error) => error.msg);
      return res.status(400).json({
        //  errors: errors.array()
        success: false,
        message: error, // chi ra moi ten
      });
    }

    //check user

    const user = await userModel.findOne({ email });

    // console.log(user.getSignedJwtToken())
    if (!user) {
      return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    sendTokenResponse(user, 200, res);
    // res.status(200).json({
    //   success: true,
    //   data: user,
    // });
    function sendTokenResponse(user, statusCode, res) {
      const token = user.getSignedJwtToken();
      
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
      });
    }

    // const user = await userModel.create({
    //   email,
    //   password
    // })

    // try {
    //   // const newUser = req.body;

    //   const user = await authService.getUserFindByEmailSignIn(email);
    //   let loadedUser = user;
    //   const isHashedPassword = bcrypt.compareSync(
    //     password,
    //     loadedUser.password
    //   );

    //   if (!isHashedPassword) {
    //     return next(new ErrorResponse(`Mật khẩu không chính xác`, 401));
    //     // const error = new Error("Mật Khẩu không chính xác");
    //     // error.statusCode = 401;
    //     // throw error;
    //   } else {
    //     const token = jwt.sign(
    //       {
    //         email: loadedUser.email,
    //         userId: loadedUser._id.toString(),
    //       },
    //       process.env.JWT_SECRET,
    //       { expiresIn: process.env.JWT_EXPIRE }
    //     );

    //     const options = {
    //       expires: new Date(
    //         Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
    //       ),
    //       httpOnly: true,
    //     };
    //     res.status(200).cookie("token", token, options).json({
    //       token: token,

    //       // userId: loadedUser._id,
    //       success: true,
    //       message: "Đăng Nhập thành công",
    //     });
    //   }
    // } catch (err) {
    //   if (!err.statusCode) {
    //     next(err);
    //   } else {
    //     res.status(err.statusCode).json({
    //       success: false,
    //       message: err.message, // chi ra moi ten
    //     });
    //   }
    // }
  }
  async getMe(req, res, next) {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  }
  async forgotPassword(req, res, next) {
    const user = await userModel.findOne({ email: req.body.email });

    //check no user
    if (!user) {
      return next(new ErrorResponse("There is no user with email", 404));
    }

    const resetToken = user.getResetPasswordToken();
    // console.log(resetToken)

    await user.save({
      validateBeforeSave: false,
    });

    // create reset url

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu. xin vui lòng thực hiện một yêu cầu đặt để: \n\n ${resetUrl} `;

    try {
      await sendEmail({
        email: user.email,
        subject: `Password reset token`,
        message,
      });
      res.status(200).json({
        success: true,
        data: "Email sent",
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse("Email could not be sent ", 500));
    }
    // res.status(200).json({
    //   success : true,
    //   data : user
    // })
  }

  async resetPassword(req, res, next) {
    // get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    console.log(user);
    sendTokenResponse(user, 200, res);
    // res.status(200).json({
    //   success: true,
    //   data: user,
    // });
    function sendTokenResponse(user, statusCode, res) {
      const token = user.getSignedJwtToken();
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
      });
    }
  }

  async updateDetails(req, res, next) {
    const { email, fullName, phone, address, password } = req.body;
    const fieldsToUpdate = req.body;

    const user = await userModel.findOne({ email: email });

   
    if (user) {
      return next(
        new ErrorResponse("Email đã tồn tại vui lòng nhập Email khác!", 401)
      );
    }
    

    const newUser = await userModel.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );
    // if(user){
    //   return next(new ErrorResponse(`Email nay da ton tai trong he thong`,400))
    // }

    res.status(200).json({
      success: true,
      data: newUser,
    });
  }
  async updatePassword(req , res ,next) {
    const user = await userModel.findById(req.user.id)

    // check password curent
    if(!(await user.matchPassword(req.body.currentPassword))){
      new ErrorResponse("Mật khẩu không chính xác!", 401)
    }

    user.password = req.body.newPassword
    await user.save()


    sendTokenResponse(user, 200, res);

    function sendTokenResponse(user, statusCode, res) {
      const token = user.getSignedJwtToken();
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
      });
    }

  }
}

module.exports = new AuthControler();
