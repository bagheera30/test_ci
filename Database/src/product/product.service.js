const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

const favoriteProducts = []; // Array untuk menyimpan ID produk favorit

const DEFAULT_PRODUCT_LIMIT = 10; // Misalnya, batas produk default

const getAllProducts = async (page = 1) => {
  const offset = (page - 1) * DEFAULT_PRODUCT_LIMIT;
  const products = await findProducts(DEFAULT_PRODUCT_LIMIT, offset);

  return products;
};

const getProductById = async (id) => {
  const product = await findProductById(id);

  if (!product) {
    throw Error("Product not found");
  }

  return product;
};

const createProduct = async (newProductData) => {
  const product = await insertProduct(newProductData);
  return product;
};

const deleteProductById = async (id) => {
  await getProductById(id);
  await deleteProduct(id);
};

const editProductById = async (id, productData) => {
  await getProductById(id);
  const product = await editProduct(id, productData);
  return product;
};

const updateStock = async (id, quantity) => {
  const product = await getProductById(id);
  product.stock += quantity; // Update stok
  await editProduct(id, product);
  return product;
};

const addFavoriteProduct = (productId) => {
  if (!favoriteProducts.includes(productId)) {
    favoriteProducts.push(productId);
  }
};

const getFavoriteProducts = async () => {
  const products = await findProducts();
  return products.filter(product => favoriteProducts.includes(product.id));
};

const removeFavoriteProduct = (productId) => {
  const index = favoriteProducts.indexOf(productId);
  if (index !== -1) {
    favoriteProducts.splice(index, 1);
  }
};

const addProductReview = async (productId, review) => {
  const product = await getProductById(productId);
  if (!product.reviews) {
    product.reviews = [];
  }
  product.reviews.push(review);
  await editProduct(productId, product);
  return product;
};

const getProductReviews = async (productId) => {
  const product = await getProductById(productId);
  return product.reviews || [];
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  addFavoriteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
  updateStock,
  addProductReview,
  getProductReviews,
};
