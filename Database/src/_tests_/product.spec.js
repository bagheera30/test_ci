// product.service.test.js
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
} = require("../product/product.service");

// Mock product repository functions
jest.mock("../product/product.repository");
const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("../product/product.repository");

// Mock product data
const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 10.99,
};

const mockProducts = [
  { id: 1, name: "Banana", price: 200 },
  { id: 2, name: "Apple", price: 150 },
  { id: 3, name: "Cherry", price: 100 },
];

describe("Product Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    findProducts.mockReset();
    findProductById.mockReset();
    insertProduct.mockReset();
    deleteProduct.mockReset();
    editProduct.mockReset();
  });

  describe("getAllProducts", () => {
    beforeEach(() => {
      findProducts.mockResolvedValue(mockProducts);
    });

    it("should return all products sorted by name in ascending order by default", async () => {
      const result = await getAllProducts();
      expect(findProducts).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 2, name: "Apple", price: 150 },
        { id: 1, name: "Banana", price: 200 },
        { id: 3, name: "Cherry", price: 100 },
      ]);
    });

    it("should return products sorted by name in descending order", async () => {
      const result = await getAllProducts('name', 'desc');
      expect(result).toEqual([
        { id: 3, name: "Cherry", price: 100 },
        { id: 1, name: "Banana", price: 200 },
        { id: 2, name: "Apple", price: 150 },
      ]);
    });

    it("should return products sorted by price in ascending order", async () => {
      const result = await getAllProducts('price', 'asc');
      expect(result).toEqual([
        { id: 3, name: "Cherry", price: 100 },
        { id: 2, name: "Apple", price: 150 },
        { id: 1, name: "Banana", price: 200 },
      ]);
    });

    it("should return products sorted by price in descending order", async () => {
      const result = await getAllProducts('price', 'desc');
      expect(result).toEqual([
        { id: 1, name: "Banana", price: 200 },
        { id: 2, name: "Apple", price: 150 },
        { id: 3, name: "Cherry", price: 100 },
      ]);
    });
  });

  describe("getProductById", () => {
    it("should return product by ID", async () => {
      // Arrange
      findProductById.mockResolvedValue(mockProduct);

      // Act
      const result = await getProductById(mockProduct.id);

      // Assert
      expect(findProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error if product is not found", async () => {
      // Arrange
      findProductById.mockResolvedValue(null);

      // Act & Assert
      await expect(getProductById(mockProduct.id)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      // Arrange
      insertProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await createProduct(mockProduct);

      // Assert
      expect(insertProduct).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProductById", () => {
    it("should delete product by ID", async () => {
      // Arrange
      findProductById.mockResolvedValue(mockProduct);
      deleteProduct.mockResolvedValue(undefined);

      // Act
      await deleteProductById(mockProduct.id);

      // Assert
      expect(findProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    });

    it("should throw an error if product is not found", async () => {
      // Arrange
      findProductById.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteProductById(mockProduct.id)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("editProductById", () => {
    it("should edit product by ID", async () => {
      // Arrange
      findProductById.mockResolvedValue(mockProduct);
      editProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await editProductById(mockProduct.id, mockProduct);

      // Assert
      expect(findProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(editProduct).toHaveBeenCalledWith(mockProduct.id, mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error if product is not found", async () => {
      // Arrange
      findProductById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        editProductById(mockProduct.id, mockProduct)
      ).rejects.toThrow("Product not found");
    });
  });
});