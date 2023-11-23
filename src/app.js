const express = require('express');
const productRouter = require('./routes/productsRouter');
const cartRouter = require('./routes/cartRouter');

const app = express();
const port = 8080;

app.use(express.json());
app.get('/', async (req, res) => {
    try {
        res.json({ message: "Bienvenido" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.listen(port, () => {
    console.log(`Servidor iniciado en:${port}`);
});
