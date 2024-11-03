
const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

const getAllProducts = async () => {
  const products = await findProducts();

  return products;
};

const getProductById = async (id: string) => {
  const product = await findProductById(id);

  if (!product) {
    throw Error("Product not found");
  }

  return product;
};

const createProduct = async (newProductData: any) => {
  const product = await insertProduct(newProductData);

  return product;
};

const deleteProductById = async (id: string) => {
  await getProductById(id);

  await deleteProduct(id);
};

const editProductById = async (id: string, productData: any) => {
  await getProductById(id);

  const product = await editProduct(id, productData)

  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
};  