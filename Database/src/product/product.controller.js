import express, { Request, Response } from "express";
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  searchProducts, // [Added Feature]
} = require("./product.service");

const router = express.Router();

// Endpoint untuk mendapatkan semua produk
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [Added Feature] Endpoint untuk mencari produk berdasarkan filter
router.get("/search", async (req, res) => {
  try {
    const filter = req.query;
    const products = await searchProducts(filter);
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint untuk mendapatkan produk berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint untuk membuat produk baru
router.post("/", async (req, res) => {
  try {
    const newProductData = req.body;

    // Validasi data produk baru
    if (
      !(
        newProductData.name &&
        newProductData.description &&
        newProductData.image &&
        newProductData.price &&
        newProductData.quantity
      )
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const product = await createProduct(newProductData);

    res.status(201).send({
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint untuk menghapus produk berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    await deleteProductById(productId);

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint untuk mengedit produk (update semua field)
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    // Validasi data untuk update produk
    if (
      !(
        productData.image &&
        productData.description &&
        productData.name &&
        productData.price &&
        productData.quantity
      )
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const product = await editProductById(productId, productData);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint untuk mengedit sebagian field produk (patch)
router.patch("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const product = await editProductById(productId, productData);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      data: product,
      message: "Product partially updated successfully",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
