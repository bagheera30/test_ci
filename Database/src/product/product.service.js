const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

const getAllProducts = async (sortBy = 'name', order = 'asc') => {
  let products = await findProducts();

  products = products.sort((a, b) => {
    if (sortBy === 'price'){  
    return order === 'asc' ? a.price - b.price : b.price - a.price;
  }
  return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);

  });

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
};
