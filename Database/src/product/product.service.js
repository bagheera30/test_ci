const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
  findProductsByFilter, // Tambahan fungsi dari repository
} = require("./product.repository");

const getAllProducts = async () => {
  const products = await findProducts();
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

// Fitur baru: Mencari produk dengan filter (nama, kategori, harga)
const searchProducts = async (filter) => {
  const products = await findProductsByFilter(filter);
  return products;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  searchProducts, // Export fungsi baru
};
