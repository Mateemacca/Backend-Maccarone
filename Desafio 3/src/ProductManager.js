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


export default ProductManager