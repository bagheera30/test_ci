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

describe("Product Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    findProducts.mockReset();
    findProductById.mockReset();
    insertProduct.mockReset();
    deleteProduct.mockReset();
    editProduct.mockReset();
  });

  describe("getTotalProducts", () => {
    it("should return the total number of products", async () => {
      // Arrange
      const mockTotal = 10; // Misalnya, kita mengharapkan ada 10 produk
      countProducts.mockResolvedValue(mockTotal); // Mock hasil dari countProducts
  
      // Act
      const result = await getTotalProducts();
  
      // Assert
      expect(countProducts).toHaveBeenCalled(); // Pastikan countProducts dipanggil
      expect(result).toEqual(mockTotal); // Pastikan hasilnya sesuai dengan mockTotal
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