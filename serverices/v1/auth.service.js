const User = require('../../models/v1/user.model')



class AuthService {
    async getUserFindByEmail (email) {
        const user = await User.findOne({email : email})
        if(user){
          throw new Error('Email đã tồn tại!')
        }
      }

}

module.exports = new AuthService()