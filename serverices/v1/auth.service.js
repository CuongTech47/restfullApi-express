const User = require('../../models/v1/user.model')



class AuthService {
    async getUserFindByEmailSignUp (email) {
        const user = await User.findOne({email : email})
        if(user){
          const error = new Error('Email đã tồn tại!');
          error.statusCode = 400;
          throw error;
        }
      }
    async getUserFindByEmailSignIn (email) {
        const user = await User.findOne({ email : email})
        if(!user){
          const error = new Error('Email không tồn tại vui lòng đăng kí !');
          error.statusCode = 400;
          throw error;
            
        }
        return user
        
    }
    // async getUserFinByEmail(email) {
    //     const user = await User.findOne({ email : email})
    //     if(!user){
    //         throw new Error('Không tô')
    //     }
    // }

}

module.exports = new AuthService()