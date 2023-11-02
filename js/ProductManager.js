class ProductManager {
    constructor() {
        this.products = [];
        this.productId = 1;
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
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log("Not Found");
        }else{
            console.log(product);
        }
        return product;
    }
}
const manager = new ProductManager();

manager.addProduct("Monitor Asus", "Monitor Gamer de alta resolucion y refresco 144Hz", 10000, "imgAsus.jpg", 001, 2005);
manager.addProduct("Mouse Logitech", "Mouse para videojuegos de alta sensibilidad", 2000, "imgLogi.jpg", 002, 1560);
manager.addProduct("Teclado mecanico Hyperx", "Teclado gamer de alta respuesta y piezas intercambiables", 6000, "imgHyper.jpg", 003, 1250);
manager.addProduct("Astro a50", "Audifonos Gamer inalambricos compatibles con PC, Xbox y PS", 5999, "imgAstro.jpg", 004, 1555);
manager.addProduct("Xbox Series X", "Consola de videojuegos de alta gama", 12000, "imgXbox.jpg", 005, 6050);



// const allProducts = manager.getProducts();
// console.log(allProducts);

//Utilizar getProductById

const productById = manager.getProductById(5);

