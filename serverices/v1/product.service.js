const Product = require("../../models/v1/product.model");

class ProductService {
  async getProductById(productId) {
    const product = await Product.findById(productId);
    if(!product){
      const error = new Error('Product Not Found');
      error.statusCode = 404;
      throw error;
      
    }
    
    return product;
  }
  async getProducts(query) {
    // const options = {
    //     page: page,
    //     limit: perPage,
    //   };
    const products = await Product.find(query);
    // const products = await Product.paginate({}, options);
    return products;
  }
  async addProduct(newProduct) {
    const product = new Product(newProduct);
    await product.save();
    return product;
  }
  async updateProduct(productId , updateProductData) {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product Not Found');
      error.statusCode = 400;
      throw error;
    }

    Object.assign(product, updateProductData);
    await product.save();
    return product;
  }
  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      const error = new Error('Product Not Found');
      error.statusCode = 400;
      throw error;
    }

    return product;
  }
}

module.exports = new ProductService();
