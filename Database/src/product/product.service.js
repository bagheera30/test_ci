const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

// Menambahkan variabel untuk batas default produk yang ditampilkan
const DEFAULT_PRODUCT_LIMIT = 100; // Misalnya, batas default untuk pengambilan produk

const getAllProducts = async (page = 1, limit = DEFAULT_PRODUCT_LIMIT) => {
  // Menghitung offset untuk pagination
  const offset = (page - 1) * limit;
  const products = await findProducts(limit, offset); // Menggunakan limit dan offset

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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  DEFAULT_PRODUCT_LIMIT, // Menambahkan variabel ke ekspor
};
