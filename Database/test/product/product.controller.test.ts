import express from 'express';
import { expect } from 'chai';
const request = require('chai-http');
import sinon from 'sinon';
const router = express.Router();
// import productRouter from '../path/to/your/router'; // Adjust the path accordingly
const {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProductById,
    editProductById,
} = require("../../src/product/product.service");// Adjust the path accordingly

const app = express();
app.use(express.json());
app.use('/products', router);

describe('Product Routes', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('GET /products', () => {
        it('should return a list of products', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 100 },
                { id: '2', name: 'Product 2', price: 200 },
            ];
            sinon.stub(getAllProducts).resolves(mockProducts);

            const res = await request(app).get('/products');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mockProducts);
        });
    });

    describe('GET /products/:id', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100 };
            sinon.stub(getProductById).resolves(mockProduct);

            const res = await request(app).get('/products/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mockProduct);
        });

        it('should return 400 if product not found', async () => {
            sinon.stub(getProductById).resolves(null);

            const res = await request(app).get('/products/non-existent-id');
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Product not found');
        });
    });

    describe('POST /products', () => {
        it('should create a new product', async () => {
            const newProductData = {
                name: 'New Product',
                description: 'Description',
                image: 'image.png',
                price: 150,
            };
            const createdProduct = { id: '1', ...newProductData };
            sinon.stub(createProduct).resolves(createdProduct);

            const res = await request(app).post('/products').send(newProductData);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                data: createdProduct,
                message: 'create product success',
            });
        });

        it('should return 400 if there is an error', async () => {
            const newProductData = {
                name: 'New Product',
                description: 'Description',
                image: 'image.png',
                price: 150,
            };
            sinon.stub(createProduct).throws(new Error('Creation failed'));

            const res = await request(app).post('/products').send(newProductData);
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Creation failed');
        });
    });

    describe('DELETE /products/:id', () => {
        it('should delete a product by ID', async () => {
            sinon.stub(deleteProductById).resolves();

            const res = await request(app).delete('/products/1');
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('product deleted');
        });

        it('should return 400 if product not found', async () => {
            sinon.stub(deleteProductById).throws(new Error('Product not found'));

            const res = await request(app).delete('/products/non-existent-id');
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Product not found');
        });
    });

    describe('PUT /products/:id', () => {
        it('should update a product and return the updated product', async () => {
            const updatedProductData = {
                name: 'Updated Product',
                description: 'Updated Description',
                image: 'updated_image.png',
                price: 200,
            };
            const updatedProduct = { id: '1', ...updatedProductData };
            sinon.stub(editProductById).resolves(updatedProduct);

            const res = await request(app).put('/products/1').send(updatedProductData);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                data: updatedProduct,
                message: 'edit product success',
            });
        });

        it('should return 400 if some fields are missing', async () => {
            const res = await request(app).put('/products/1').send({});
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Some fields are missing');
        });

        it('should return 400 if there is an error', async () => {
            const updatedProductData = {
                name: 'Updated Product',
                description: 'Updated Description',
                image: 'updated_image.png',
                price: 200,
            };
            sinon.stub(editProductById).throws(new Error('Update failed'));

            const res = await request(app).put('/products/1').send(updatedProductData);
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Update failed');
        });
    });

    describe('PATCH /products/:id', () => {
        it('should update a product and return the updated product', async () => {
            const updatedProductData = {
                name: 'Updated Product',
                description: 'Updated Description',
                image: 'updated_image.png',
                price: 200,
            };
            const updatedProduct = { id: '1', ...updatedProductData };
            sinon.stub(editProductById).resolves(updatedProduct);

            const res = await request(app).patch('/products/1').send(updatedProductData);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                data: updatedProduct,
                message: 'edit product success',
            });
        });

        it('should return 400 if there is an error', async () => {
            const updatedProductData = {
                name: 'Updated Product',
                description: 'Updated Description',
                image: 'updated_image.png',
                price: 200,
            };
            sinon.stub(editProductById).throws(new Error('Update failed'));

            const res = await request(app).patch('/products/1').send(updatedProductData);
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Update failed');
        });
    });
});