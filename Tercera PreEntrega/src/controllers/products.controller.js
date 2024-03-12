import ProductRepository from '../dao/repositories/product.repository.js';
import productModel from '../dao/models/products.model.js';
export const productsService = new ProductRepository(productModel);
export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;
        const [code, value] = query.split(':');
        const products = await productsService.getProducts(limit, page, code, value, sort);
        res.send({ status: 'success', ...products });
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener los productos' });
        console.log(error);
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsService.getProductById(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener el producto' });
    }
};

export const addProduct = async (req, res) => {
    try {
        const newProduct = await productsService.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).send({ error: 'Error al agregar el producto' });
    }
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productsService.updateProduct(pid, req.body);
        if (updatedProduct) {
            res.send({ message: "producto actualizado" });
        } else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error al actualizar el producto' });
        console.error(error);
    }
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await productsService.deleteProduct(pid);
        res.send({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(400).send({ error: 'Error al eliminar el producto' });
    }
};
