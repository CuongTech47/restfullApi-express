const userService = require("../../serverices/v1/user.service");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
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
      const email = req.body.email;
      const fullName = req.body.fullName;
      const passwordHashed = req.body.password;
      const phone = req.body.phone;
      const address = req.body.address;

      var salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(passwordHashed, salt);
      console.log(password)
      const newUser = { email, fullName, phone, address, password };
      const user = await userService.addUser(newUser);
      res.status(201).json({
        success: true,
        message: "Thêm User thành công",
        userId : user._id,
      });

      // const user = await userService.addUser(newUser)
      // res.status(201).json({
      //     success: true,
      //     message: "Thêm User thành công",
      //     user
      // })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  async signIn(req , res , next){
    // res.json({
        
    // })
  }
}

module.exports = new AuthControler();
