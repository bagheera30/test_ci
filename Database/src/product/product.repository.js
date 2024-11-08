const db = require("../libs/db");
const prisma = db.getInstance();

const ProductData = {
  name: "",
  deskripsi: "",
  image: "",
  price: 0,
  quantity: 0,
};

// Mendapatkan semua produk
const findProducts = async () => {
  const products = await prisma.Products.findMany();
  return products;
};

// Mendapatkan produk berdasarkan ID
const findProductById = async (id) => {
  const product = await prisma.Products.findUnique({
    where: {
      id,
    },
  });
  return product;
};

// Menambahkan produk baru
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

// Menghapus produk berdasarkan ID
const deleteProduct = async (id) => {
  await prisma.Products.delete({
    where: {
      id,
    },
  });
  // DELETE FROM products WHERE id = {productId}
};

// Mengedit produk berdasarkan ID
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

// fitur baru: mencari produk berdasarkan filter (nama, kategori, rentang harga)
const findProductsByFilter = async (filter) => {
  const { name, category, minPrice, maxPrice } = filter;

  const products = await prisma.Products.findMany({
    where: {
      // mencari produk berdasarkan nama (partial match)
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      // mencari produk berdasarkan kategori
      category: category ? category : undefined,
      // mencari produk berdasarkan rentang harga
      price: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    },
  });

  return products;
};


module.exports = {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
  findProductsByFilter, // fitur baru
};
