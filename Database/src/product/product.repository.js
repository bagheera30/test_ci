const db = require("../libs/db");

const prisma = db.getInstance();

const ProductData = {
  name: "",
  deskripsi: "",
  image: "",
  price: 0,
  quantity: 0,
};

const findProducts = async () => {
  const products = await prisma.Products.findMany();

  return products;
};

const findProductById = async (id) => {
  const product = await prisma.Products.findUnique({
    where: {
      id,
    },
  });

  return product;
};

const insertProduct = async (productData) => {
  const product = await prisma.Products.create({
    data: {
      name: productData.name,
      deskripsi: productData.deskripsi,
      image: productData.image,
      price: productData.price,
      quantity: productData.quantity,
    },
  });

  return product;
};

const deleteProduct = async (id) => {
  await prisma.Products.delete({
    where: {
      id,
    },
  });
  // DELETE FROM products WHERE id = {productId}
};

const editProduct = async (id, productData) => {
  const product = await prisma.Products.update({
    where: {
      id,
    },
    data: {
      deskripsi: productData.deskripsi,
      image: productData.image,
      name: productData.name,
      price: productData.price,
    },
  });

  return product;
};

module.exports = {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
};
