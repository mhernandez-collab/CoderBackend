const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const productRouter = require('./routes/productsRouter');
const cartRouter = require('./routes/cartRouter');
const ProductManager = require('../js/ProductManager'); 
const productManager = new ProductManager('./data/products.json');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 8080;

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

io.on('connection', (socket) => {
    console.log('Usuario conectado');
    const allProducts = productManager.getProducts();
    socket.emit('actualizarProductos', allProducts);
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

app.use(express.json());
app.use(express.static('public')); 
app.get('/', async (req, res) => {
    try {
        res.json({ message: "Bienvenido" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/home', (req, res) => {
    try {
        const products = productManager.getProducts();
        console.log(products);
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/realtimeproducts', (req, res) => {
    try {
        const products = productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/products', (req, res) => {
    try {
        const { title, description, price, code, status = true, stock } = req.body;
        productManager.addProduct(title, description, price, code, status, stock);
        io.emit('actualizarProductos', productManager.getProducts());
        res.json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        io.emit('mensaje', { type: 'error', text: 'Error al agregar el producto' });
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/products/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        productManager.deleteProduct(productId);
        io.emit('actualizarProductos', productManager.getProducts());
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

server.listen(port, () => {
    console.log(`Servidor iniciado en:${port}`);
});
