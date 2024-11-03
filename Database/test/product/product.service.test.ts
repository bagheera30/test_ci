import { expect } from 'chai';
import sinon from 'sinon';
const {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProductById,
    editProductById,
} = require('../../src/product/product.service'); // Adjust the path accordingly
const {
    findProducts,
    findProductById,
    insertProduct,
    deleteProduct,
    editProduct,
} = require('../../src/product/product.repository'); // Adjust the path accordingly

describe('Product Service', () => {
    beforeEach(() => {
        sinon.stub(findProducts);
        sinon.stub(findProductById);
        sinon.stub(insertProduct);
        sinon.stub(deleteProduct);
        sinon.stub(editProduct);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAllProducts', () => {
        it('should return a list of products', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 100 },
                { id: '2', name: 'Product 2', price: 200 },
            ];
            findProducts.resolves(mockProducts);

            const products = await getAllProducts();
            expect(products).to.deep.equal(mockProducts);
            expect(findProducts.calledOnce).to.be.true;
        });
    });

    describe('getProductById', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100 };
            findProductById.resolves(mockProduct);

            const product = await getProductById('1');
            expect(product).to.deep.equal(mockProduct);
            expect(findProductById.calledOnce).to.be.true;
            expect(findProductById.calledWith('1')).to.be.true;
        });

        it('should throw an error if product not found', async () => {
            findProductById.resolves(null);

            try {
                await getProductById('non-existent-id');
            } catch (error: any) {
                expect(error.message).to.equal('Product not found');
            }
        });
    });

    describe('createProduct', () => {
        it('should insert a new product and return it', async () => {
            const newProductData = {
                name: 'New Product',
                deskripsi: 'Description',
                image: 'image.png',
                price: 150,
                quantity: 10,
            };
            const createdProduct = { id: '1', ...newProductData };
            insertProduct.resolves(createdProduct);

            const product = await createProduct(newProductData);
            expect(product).to.deep.equal(createdProduct);
            expect(insertProduct.calledOnce).to.be.true;
            expect(insertProduct.calledWith(newProductData)).to.be.true;
        });
    });

    describe('deleteProductById', () => {
        it('should delete a product by ID', async () => {
            const productId = '1';
            const mockProduct = { id: productId, name: 'Product 1', price: 100 };
            findProductById.resolves(mockProduct);
            deleteProduct.resolves();

            await deleteProductById(productId);
            expect(findProductById.calledOnce).to.be.true;
            expect(deleteProduct.calledOnce).to.be.true;
            expect(deleteProduct.calledWith(productId)).to.be.true;
        });

        it('should throw an error if product not found', async () => {
            const productId = 'non-existent-id';
            findProductById.resolves(null);

            try {
                await deleteProductById(productId);
            } catch (error: any) {
                expect(error.message).to.equal('Product not found');
            }
        });
    });

    describe('editProductById', () => {
        it('should update a product and return the updated product', async () => {
            const productId = '1';
            const updatedProductData = {
                name: 'Updated Product',
                deskripsi: 'Updated Description',
                image: 'updated_image.png',
                price: 200,
                quantity: 5,
            };
            const updatedProduct = { id: productId, ...updatedProductData };
            findProductById.resolves({ id: productId, name: 'Product 1', price: 100 });
            editProduct.resolves(updatedProduct);

            const product = await editProductById(productId, updatedProductData);
            expect(product).to.deep.equal(updatedProduct);
            expect(findProductById.calledOnce).to.be.true;
            expect(editProduct.calledOnce).to.be.true;
            expect(editProduct.calledWith(productId, updatedProductData)).to.be.true;
        });

        it('should throw an error if product not found', async () => {
            const productId = 'non-existent-id';
            findProductById.resolves(null);

            try {
                await editProductById(productId, {});
            } catch (error: any) {
                expect(error.message).to.equal('Product not found');
            }
        });
    });
});