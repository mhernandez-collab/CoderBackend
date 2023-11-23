
const express = require('express');
const ProductManager = require('../../js/ProductManager');

const productRouter = express.Router();
const productManager = new ProductManager('./data/products.json');

productRouter.get('/', (req, res) => {
    try {
        const limit = req.query.limit;
        const products = productManager.getProducts();
        const responseProducts = limit ? products.slice(0, limit) : products;
        res.json({ products: responseProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);
        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productRouter.post('/', (req, res) => {
    try {
        const { title, description, price, code, status = true, stock } = req.body;
        productManager.addProduct(title, description, price, code, status, stock);
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productRouter.put('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        productManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productRouter.delete('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        productManager.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = productRouter;
