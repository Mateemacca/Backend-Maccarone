import ProductRepository from '../dao/repositories/product.repository.js';
import productModel from '../dao/models/products.model.js';
import { generateProduct } from '../utils/faker.js';
export const productsService = new ProductRepository(productModel);
export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;
        const [code, value] = query.split(':');
        const products = await productsService.getProducts(limit, page, code, value, sort);
        res.send({ status: 'success', ...products });
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener los productos' });
        req.logger.error('Error al obtener productos');
        console.log(error);
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsService.getProductById(pid);
        if (product) {
            req.logger.info('Producto por ID encontrado!');
            res.send(product);
        } else {
            req.logger.error('Producto no encontrado');
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al buscar el producto');
        res.status(400).send({ error: 'Error al obtener el producto' });
    }
};

export const addProduct = async (req, res) => {
    try {
        const newProduct = await productsService.addProduct(req.body);
        res.status(201).json(newProduct);
        req.logger.info('Producto agregado creado con exito!');

    } catch (error) {
        req.logger.error('Error al crear el producto');
        res.status(400).send({ error: 'Error al agregar el producto' });
    }
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productsService.updateProduct(pid, req.body);
        if (updatedProduct) {
            req.logger.info('Producto actualizado con exito');
            res.send({ message: "Producto actualizado" });
        } else {
            req.logger.error('Producto no encontrado');
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al actualizar el producto');
        res.status(400).send({ error: 'Error al actualizar el producto' });
        console.error(error);
    }
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await productsService.deleteProduct(pid);
        req.logger.info('Producto actualizado con exito');
        res.send({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        req.logger.error('Error al eliminar el producto');
        res.status(400).send({ error: 'Error al eliminar el producto' });
    }
};

export const mockedProducts = async (req, res) => {
    const users = [];
    for(let i=0; i < 100; i++){
        users.push(generateProduct());
    }
    res.send({status: 'success', payload: users});
};