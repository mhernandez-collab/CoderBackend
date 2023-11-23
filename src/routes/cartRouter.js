const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 

const cartRouter = express.Router();

const cartsPath = './data/carts.json';

function readCartsData() {
    try {
        const data = fs.readFileSync(cartsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveCartsData(data) {
    fs.writeFileSync(cartsPath, JSON.stringify(data, null, 2), 'utf8');
}

cartRouter.post('/', (req, res) => {
    try {
        const cartId = uuidv4();
        const newCart = { id: cartId, products: [] };
        const cartsData = readCartsData();

        cartsData.push(newCart);
        saveCartsData(cartsData);
        res.status(201).json({ message: 'Carrito creado correctamente', cartId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartRouter.get('/:cid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartsData = readCartsData();
        const cart = cartsData.find(cart => cart.id === cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        res.json({ products: cart.products });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartRouter.get('/', (req, res) => {
    try {
        const cartsData = readCartsData();
        res.json({ carts: cartsData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const cartsData = readCartsData();
        const cart = cartsData.find(cart => cart.id === cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            cart.products.push({ id: productId, quantity: quantity || 1 });
        }
        saveCartsData(cartsData);

        res.status(201).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = cartRouter;
