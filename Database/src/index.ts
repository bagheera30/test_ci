import express, { Request, Response } from "express";
const dotenv = require("dotenv");

const cors = require("cors");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())

const port = process.env.PORT;
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, untuk menggunakan api jika mencari produk maka harus /products");
});
const productController = require("./product/product.controller");
const usersController = require("./users/users.controller");
app.use("/users", usersController);

app.use("/products", productController);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
