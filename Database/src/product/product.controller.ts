
import express, { Request, Response } from "express";
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
} = require("./product.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getAllProducts();

  res.send(products);
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);

    res.send(product);
  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newProductData = req.body;

    const product = await createProduct(newProductData);

    res.send({
      data: product,
      message: "create product success",
    });
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id; // string

    await deleteProductById(productId);

    res.send("product deleted");
  } catch (error: Error | any) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  if (
    !(
      productData.image &&
      productData.description &&
      productData.name &&
      productData.price
    )
  ) {
    return res.status(400).send("Some fields are missing");
  }

  const product = await editProductById(productId, productData);

  res.send({
    data: product,
    message: "edit product success",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const product = await editProductById(productId, productData);

    res.send({
      data: product,
      message: "edit product success",
    });
  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

module.exports = router;