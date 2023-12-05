import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    static id = 0;

    async addProduct(producto) {
        ProductManager.id++;
        try {
            const productos = await this.getProducts();
            const newProduct = {
                id: ProductManager.id,
                ...producto,
            };
            productos.push(newProduct);
            await this.guardarProductos(productos);
            return newProduct;
        } catch (error) {
            console.error('error al agregar el producto');
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
                console.log('Error al obtener los productos');
                return [];
        }
    }
    

    async getProductById(id) {
        try {
            const productos = await this.getProducts();
            const productoEncontrado = productos.find((producto) => producto.id === id);
            
            if (productoEncontrado === undefined) {
                console.log('Error, No se encontro el producto con ese id');
            }
            return productoEncontrado;
        } catch (error) {
            console.log('Error al obtener el producto por ID');
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const productos = await this.getProducts();
            const productoIndex = productos.findIndex((producto) => producto.id === id);
    
            if (productoIndex !== -1) {
                productos[productoIndex] = {...productos[productoIndex], ...updatedProduct};
                await this.guardarProductos(productos);
                return productos[productoIndex];
            } else {
                console.log('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const productos = await this.getProducts();
            const productoParaEliminar = productos.find((producto) => producto.id === id);
            if (!productoParaEliminar) {
                console.log('producto para eliminar no encontrado');
                return;
            }
            const productosActualizados = productos.filter((producto) => producto.id !== id);
            await this.guardarProductos(productosActualizados);
        } catch (error) {
            console.error('Error al eliminar el producto');
        }
    }

    async guardarProductos(productos) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(productos,null,2)); // "null" y "2" para que se acomode bien el array en el JSON
        } catch (error) {
            console.error('Error al intentar guardar los productos');
        }
    }
}

     // Como usar el codigo/Test
const productManager = new ProductManager('productos.json');

// const test = async () => {
//     await productManager.addProduct({
//         title: 'Laptop',
//         description: 'Potente computadora portátil para todas tus necesidades.',
//         price: 999.99,
//         thumbnail: 'img/laptop.jpg',
//         code: 'ABC123',
//         stock: 50,
//     });
//     await productManager.addProduct({
//         title: 'PS5',
//         description: 'Consola de última generación para juegos inmersivos.',
//         price: 499.99,
//         thumbnail: 'img/ps5.jpg',
//         code: 'DEF456',
//         stock: 20,
//     });
//     await productManager.addProduct({
//         title: 'iPhone',
//         description: 'Teléfono inteligente con la última tecnología de Apple.',
//         price: 899.99,
//         thumbnail: 'img/iphone.jpg',
//         code: 'GHI789',
//         stock: 30,
//     });
//     await productManager.addProduct({
//         title: 'Smart TV',
//         description: 'Televisor inteligente con resolución 4K y funciones avanzadas.',
//         price: 699.99,
//         thumbnail: 'img/smart_tv.jpg',
//         code: 'JKL123',
//         stock: 25,
//     });
//     await productManager.addProduct({
//         title: 'Cámara DSLR',
//         description: 'Cámara profesional para capturar momentos inolvidables.',
//         price: 799.99,
//         thumbnail: 'img/camera.jpg',
//         code: 'MNO456',
//         stock: 15,
//     });

//     console.log('Mostrando todos los productos:', await productManager.getProducts());

//     // const productoPorId = await productManager.getProductById(3); // Aca ponemos el id del producto a buscar
//     // console.log('Producto buscado por Id:', productoPorId);

//     // // Aca vemos como actualizar un producto
//     // await productManager.updateProduct(2, {
//     //     price: 500,
//     //     stock:100,
//     // });
//     // console.log('Producto actualizado');


//     // Este es el codigo para eliminar un producto por su id:
//     // await productManager.deleteProduct(5);
    
// };
// test()

export default ProductManager