import { expect } from 'chai';
import sinon from 'sinon';
const db = require('../../src/libs/db');
const {
    findProducts,
    findProductById,
    insertProduct,
    deleteProduct,
    editProduct,
} = require('../../src/product/product.repository'); // Adjust the path accordingly

const prismaMock = {
    Products: {
        findMany: sinon.stub(),
        findUnique: sinon.stub(),
        create: sinon.stub(),
        delete: sinon.stub(),
        update: sinon.stub(),
    },
};

describe('Products Service', () => {
    beforeEach(() => {
        sinon.stub(db, 'getInstance').returns(prismaMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('findProducts', () => {
        it('should return a list of products', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 100 },
                { id: '2', name: 'Product 2', price: 200 },
            ];
            prismaMock.Products.findMany.resolves(mockProducts);

            const products = await findProducts();
            expect(products).to.deep.equal(mockProducts);
            expect(prismaMock.Products.findMany.calledOnce).to.be.true;
        });
    });

    describe('findProductById', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100 };
            prismaMock.Products.findUnique.resolves(mockProduct);

            const product = await findProductById('1');
            expect(product).to.deep.equal(mockProduct);
            expect(prismaMock.Products.findUnique.calledOnce).to.be.true;
            expect(prismaMock.Products.findUnique.calledWith({ where: { id: '1' } })).to.be.true;
        });

        it('should return null if product not found', async () => {
            prismaMock.Products.findUnique.resolves(null);

            const product = await findProductById('non-existent-id');
            expect(product).to.be.null;
        });
    });

    describe('insertProduct', () => {
        it('should insert a new product and return it', async () => {
            const newProductData = {
                name: 'New Product',
                deskripsi: 'Description',
                image: 'image.png',
                price: 150,
                quantity: 10,
            };
            const createdProduct = { id: '1', ...newProductData };
            prismaMock.Products.create.resolves(createdProduct);

            const product = await insertProduct(newProductData);
            expect(product).to.deep.equal(createdProduct);
            expect(prismaMock.Products.create.calledOnce).to.be.true;
            expect(prismaMock.Products.create.calledWith({ data: newProductData })).to.be.true;
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product by ID', async () => {
            const productId = '1';
            prismaMock.Products.delete.resolves();

            await deleteProduct(productId);
            expect(prismaMock.Products.delete.calledOnce).to.be.true;
            expect(prismaMock.Products.delete.calledWith({ where: { id: productId } })).to.be.true;
        });
    });

    describe('editProduct', () => {
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
            prismaMock.Products.update.resolves(updatedProduct);

            const product = await editProduct(productId, updatedProductData);
            expect(product).to.deep.equal(updatedProduct);
            expect(prismaMock.Products.update.calledOnce).to.be.true;
            expect(prismaMock.Products.update.calledWith({ where: { id: productId }, data: updatedProductData })).to.be.true;
        });
    });
});