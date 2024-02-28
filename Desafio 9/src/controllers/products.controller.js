

import productModel from '../dao/models/products.model.js';

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;
        const [code, value] = query.split(':');
        console.log({ [code]: value });
        const products = await productModel.paginate({ [code]: value }, {
            limit,
            page,
            sort: sort ? { price: sort } : {}
        });
        if (products) {
            products.payload = products.docs;
            delete products.docs;
            res.send({ status: 'success', ...products });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener los productos' });
        console.log(error);
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productModel.findOne({ _id: pid });
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
        const newProduct = await productModel.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).send({ error: 'Error al agregar el producto' });
    }
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productModel.updateOne({ _id: pid }, req.body);
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
        await productModel.deleteOne({ _id: pid });
        res.send({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(400).send({ error: 'Error al eliminar el producto' });
    }
};
