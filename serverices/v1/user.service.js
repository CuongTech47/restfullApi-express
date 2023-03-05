const User = require('../../models/v1/user.model')


class UserService {
    async getUsertById(productId) {
        const product = await Product.findById(productId);
        return product;
      }
      async getUsers() {
        const products = await Product.find();
        return products;
      }
      async addUser(newProduct) {
        const product = new Product(newProduct);
        await product.save();
        return product;
      }
      async updateProduct(productId , updateProductData) {
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found");
        }
    
        Object.assign(product, updateProductData);
        await product.save();
        return product;
      }
      async deleteProduct(productId) {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
          throw new Error('Product not found');
        }
    
        return product;
      }
}