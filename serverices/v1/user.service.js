const User = require('../../models/v1/user.model')


class UserService {
    async getUsertById(userId) {
        const user = await Product.findById(userId);
        return user;
      }
      async getUsers() {
        const products = await Product.find();
        return products;
      }
      async addUser(newUser) {
        const user = new User(newUser);
        await user.save();
        return user;
      }
      async updateUser(productId , updateProductData) {
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("User not found");
        }
    
        Object.assign(product, updateProductData);
        await product.save();
        return product;
      }
      async deleteUser(productId) {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
          throw new Error('User not found');
        }
    
        return product;
      }
      // async getUserFindByEmail (email) {
      //   const user = await User.findOne({email : email})
      //   if(user){
      //     throw new Error('Email đã tồn tại!')
      //   }
          
      // }
}

module.exports = new UserService()