const Product = require("../../models/v1/product.model");

class ProductService {
  async getProductById(productId) {
    const product = await Product.findById(productId);
    return product;
  }
  async getProducts(page, perPage) {
    const options = {
        page: page,
        limit: perPage,
      };
    // const products = await Product.find();
    const products = await Product.paginate({}, options);
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

module.exports = new ProductService();
