const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  addFavoriteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
  updateStock,
} = require("./product.service");

const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

// Mock repository functions
jest.mock("./product.repository");

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all products with pagination", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", stock: 100 },
        { id: 2, name: "Product 2", stock: 50 },
      ];
      findProducts.mockResolvedValue(mockProducts);

      const result = await getAllProducts(1);

      expect(findProducts).toHaveBeenCalledWith(10, 0); // Memeriksa pemanggilan dengan default limit
      expect(result).toEqual(mockProducts); // Memeriksa hasil yang diharapkan
    });

    it("should return an empty array if no products found", async () => {
      findProducts.mockResolvedValue([]);

      const result = await getAllProducts(1);

      expect(findProducts).toHaveBeenCalledWith(10, 0); // Memeriksa pemanggilan dengan default limit
      expect(result).toEqual([]); // Memeriksa hasil yang diharapkan
    });
  });

  describe("getProductById", () => {
    it("should return product details if found", async () => {
      const mockProduct = { id: 1, name: "Product 1", stock: 100 };
      findProductById.mockResolvedValue(mockProduct);

      const result = await getProductById(1);

      expect(findProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error if product is not found", async () => {
      findProductById.mockResolvedValue(null);

      await expect(getProductById(1)).rejects.toThrow("Product not found");
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProductData = { name: "New Product", stock: 100 };
      const mockProduct = { id: 3, ...newProductData };
      insertProduct.mockResolvedValue(mockProduct);

      const result = await createProduct(newProductData);

      expect(insertProduct).toHaveBeenCalledWith(newProductData);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProductById", () => {
    it("should delete a product by id", async () => {
      const mockProduct = { id: 1, name: "Product 1" };
      findProductById.mockResolvedValue(mockProduct);

      await deleteProductById(1);

      expect(findProductById).toHaveBeenCalledWith(1);
      expect(deleteProduct).toHaveBeenCalledWith(1);
    });

    it("should throw an error if product to delete is not found", async () => {
      findProductById.mockResolvedValue(null);

      await expect(deleteProductById(1)).rejects.toThrow("Product not found");
    });
  });

  describe("editProductById", () => {
    it("should edit a product", async () => {
      const mockProduct = { id: 1, name: "Product 1", stock: 100 };
      const updatedData = { name: "Updated Product" };
      findProductById.mockResolvedValue(mockProduct);
      editProduct.mockResolvedValue({ ...mockProduct, ...updatedData });

      const result = await editProductById(1, updatedData);

      expect(findProductById).toHaveBeenCalledWith(1);
      expect(editProduct).toHaveBeenCalledWith(1, {
        ...mockProduct,
        ...updatedData,
      });
      expect(result).toEqual({ ...mockProduct, ...updatedData });
    });
  });

  describe("updateStock", () => {
    it("should update the stock of a product", async () => {
      const mockProduct = { id: 1, name: "Product 1", stock: 100 };
      findProductById.mockResolvedValue(mockProduct);
      editProduct.mockResolvedValue({ ...mockProduct, stock: 120 });

      const result = await updateStock(1, 20); // Menambah 20 stok

      expect(findProductById).toHaveBeenCalledWith(1);
      expect(editProduct).toHaveBeenCalledWith(1, {
        ...mockProduct,
        stock: 120,
      });
      expect(result).toEqual({ ...mockProduct, stock: 120 });
    });
  });

  describe("Favorite Products", () => {
    beforeEach(() => {
      // Reset favoriteProducts before each test
      global.favoriteProducts = [];
    });

    it("should add a product to favorites", () => {
      addFavoriteProduct(1);
      expect(global.favoriteProducts).toContain(1);
    });

    it("should not add a duplicate product to favorites", () => {
      addFavoriteProduct(1);
      addFavoriteProduct(1);
      expect(global.favoriteProducts).toEqual([1]); // Harus tetap satu
    });

    it("should get favorite products", async () => {
      const mockProduct = { id: 1, name: "Product 1", stock: 100 };
      favoriteProducts.push(1);
      findProducts.mockResolvedValue([mockProduct]);

      const result = await getFavoriteProducts();

      expect(result).toEqual([mockProduct]);
    });

    it("should remove a product from favorites", () => {
      favoriteProducts.push(1);
      removeFavoriteProduct(1);
      expect(global.favoriteProducts).not.toContain(1);
    });

    it("should not throw error when removing a product that is not in favorites", () => {
      expect(() => removeFavoriteProduct(1)).not.toThrow();
    });
  });
});
