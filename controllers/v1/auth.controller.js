const userService = require("../../serverices/v1/user.service");
const authService = require("../../serverices/v1/auth.service")
const jwt = require('jsonwebtoken')
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
        message: err.message
      });
    }
  }
  async signIn(req , res , next){
    const email = req.body.email
    const password = req.body.password
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array().map((error) => error.msg);
      return res.status(401).json({
        //  errors: errors.array()
        success: false,
        message: error, // chi ra moi ten
      });
    }
    try {
       
        // const newUser = req.body;
        const user = await authService.getUserFindByEmailSignIn(email)
        let loadedUser = user
        const isHashedPassword = bcrypt.compareSync(password , loadedUser.password)
       

        if(!isHashedPassword){
            const error = new Error('Mật Khẩu không chính xác')
            error.statusCode = 401
            throw error
        }else{
            const token = jwt.sign({
                email : loadedUser.email,
                userId : loadedUser._id.toString()


            },
            'secretKey',
            {expiresIn : '1h'}
            )
            res.status(200).json({
                token : token,
                userId : loadedUser._id,
                success : true,
                message : "Đăng Nhập thành công"
            })
        }
        

    }catch(err){
        console.log(err.statusCode)
       
        if(!err.statusCode){
            err.statusCode = 500
            res.status(err.statusCode).json({
                success: false,
                message: err.message, // chi ra moi ten
            })

        }else{
            res.status(err.statusCode).json({
                success: false,
                message: err.message, // chi ra moi ten
            })
        }
        // console.log(err)
        // return res.status(err.statusCode).json({

        //     if(!err.statusCode){

        //     }
        //     //  errors: errors.array()

        //     success: false,
        //     message: err.message, // chi ra moi ten
        //   });
    }
    
//    bcrypt.compareSync(password, )
  }
}

module.exports = new AuthControler();
