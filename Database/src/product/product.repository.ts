export { }
const db = require("../libs/db");

const prisma = db.getInstance();

interface ProductData {
  name: string;
  deskripsi: string;
  image: string;
  price: number;
  quantity: number;
}

const findProducts = async () => {
  const products = await prisma.Products.findMany();

  return products;
};

const findProductById = async (id: string) => {
  const product = await prisma.Products.findUnique({
    where: {
      id,
    },
  });

  return product;
};

const insertProduct = async (productData: ProductData) => {
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

const deleteProduct = async (id: string) => {
  await prisma.Products.delete({
    where: {
      id,
    },
  });
  // DELETE FROM products WHERE id = {productId}
};

const editProduct = async (id: string, productData: ProductData) => {
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