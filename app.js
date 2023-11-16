const express = require('express');
const app = express();
const ProductManager = require('./js/ProductManager'); 

const port = 3000;
const manager = new ProductManager('./data/products.json');

app.use(express.json());

// Endpoint para obtener todos los productos con límite opcional
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await manager.getProducts();
        const responseProducts = limit ? products.slice(0, limit) : products;
        res.json({ products: responseProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await manager.getProductById(productId);
        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
