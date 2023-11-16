const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = this.loadProducts();
        this.productId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error("El Producto ingresado ya existe");
        }

        const newProduct = {
            id: this.productId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        this.products.push(newProduct);
        this.productId++;

        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
        this.saveProducts();
    }

    deleteProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== id);
        if (this.products.length === initialLength) {
            throw new Error("Producto no encontrado");
        }

        this.saveProducts();
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}

const manager = new ProductManager('./data/products.json');

// manager.addProduct("Monitor Asus", "Monitor Gamer de alta resolucion y refresco 144Hz", 10000, "imgAsus.jpg", 001, 2005);
// manager.addProduct("Mouse Logitech", "Mouse para videojuegos de alta sensibilidad", 2000, "imgLogi.jpg", 002, 1560);
// manager.addProduct("Teclado mecanico Hyperx", "Teclado gamer de alta respuesta y piezas intercambiables", 6000, "imgHyper.jpg", 003, 1250);
// manager.addProduct("Astro a50", "Audifonos Gamer inalambricos compatibles con PC, Xbox y PS", 5999, "imgAstro.jpg", 004, 1555);
// manager.addProduct("Xbox Series X", "Consola de videojuegos de alta gama", 12000, "imgXbox.jpg", 005, 6050);const allProducts = manager.getProducts();

// console.log(allProducts);


// //Utilizar getProductById
// const productById = manager.getProductById(1);
// console.log(productById);

// //Utilizar updateProduct
// manager.updateProduct(1, { title: "Monitor LG" });
// const updatedProduct = manager.getProductById(1);
// console.log(updatedProduct);

// //Utilizar deleteProduct
// manager.deleteProduct(1);
// try {
//     const deletedProduct = manager.getProductById(1);
//     console.log(deletedProduct);
// } catch (error) {
//     console.log(error.message);
// }

module.exports = ProductManager;


