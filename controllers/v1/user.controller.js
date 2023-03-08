const userService = require("../../serverices/v1/user.service");
const { validationResult } = require("express-validator");
class UserController {
  async addUser(req, res, next) {
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
        const newUser = req.body
        const user = await userService.addUser(newUser)
        res.status(201).json({
            success: true,
            message: "Thêm User thành công",
            user
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
  }
}

module.exports = new UserController();
