const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
} = require("../src/product/product.service");
const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("../src/productproduct.repository");

// Mock data for testing
const mockProducts = [
  {
    id: "1",
    name: "Product A",
    description: "Description of Product A",
    image: "https://example.com/product-a.jpg",
    price: 100,
    quantity: 10,
  },
  {
    id: "2",
    name: "Product B",
    description: "Description of Product B",
    image: "https://example.com/product-b.jpg",
    price: 200,
    quantity: 5,
  },
];

jest.mock("../src/product/product.repository", () => ({
  findProducts: jest.fn(() => Promise.resolve(mockProducts)),
  findProductById: jest.fn((id) =>
    Promise.resolve(mockProducts.find((p) => p.id === id))
  ),
  insertProduct: jest.fn((productData) =>
    Promise.resolve({ ...productData, id: "3" })
  ),
  deleteProduct: jest.fn((id) => Promise.resolve()),
  editProduct: jest.fn((id, productData) =>
    Promise.resolve({
      ...mockProducts.find((p) => p.id === id),
      ...productData,
    })
  ),
}));

describe("Product Service", () => {
  it("should get all products", async () => {
    const products = await getAllProducts();
    expect(products).toEqual(mockProducts);
    expect(findProducts).toHaveBeenCalledTimes(1);
  });

  it("should get a product by ID", async () => {
    const productId = "1";
    const product = await getProductById(productId);
    expect(product).toEqual(mockProducts[0]);
    expect(findProductById).toHaveBeenCalledWith(productId);
  });

  it("should throw an error if product not found", async () => {
    const productId = "999";
    await expect(getProductById(productId)).rejects.toThrowError(
      "Product not found"
    );
    expect(findProductById).toHaveBeenCalledWith(productId);
  });

  it("should create a new product", async () => {
    const newProduct = {
      name: "Product C",
      description: "Description of Product C",
      image: "https://example.com/product-c.jpg",
      price: 300,
      quantity: 2,
    };

    const createdProduct = await createProduct(newProduct);
    expect(createdProduct).toEqual({ ...newProduct, id: "3" });
    expect(insertProduct).toHaveBeenCalledWith(newProduct);
  });

  it("should delete a product by ID", async () => {
    const productId = "1";
    await deleteProductById(productId);
    expect(getProductById).toHaveBeenCalledWith(productId);
    expect(deleteProduct).toHaveBeenCalledWith(productId);
  });

  it("should edit a product by ID", async () => {
    const productId = "1";
    const updatedProduct = {
      name: "Updated Product A",
      description: "Updated Description of Product A",
      image: "https://example.com/updated-product-a.jpg",
      price: 150,
      quantity: 12,
    };

    const editedProduct = await editProductById(productId, updatedProduct);
    expect(editedProduct).toEqual({
      ...mockProducts[0],
      ...updatedProduct,
    });
    expect(getProductById).toHaveBeenCalledWith(productId);
    expect(editProduct).toHaveBeenCalledWith(productId, updatedProduct);
  });
});
