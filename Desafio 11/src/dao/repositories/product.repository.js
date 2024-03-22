import CustomErrors from '../../services/errors/CustomErrors.js'
import ErrorEnum from '../../services/errors/error.enum.js'
import { generateProductErrorInfo, productNotFound } from '../../services/errors/info.js';

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts(limit = 10, page = 1, code, value, sort) {
        const filter = code ? { [code]: value } : {};
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort } : {}
        };

        try {
            const products = await this.dao.paginate(filter, options);
            return products;
        } catch (error) {
            console.log('Error al obtener los productos');
        }
    }

    async getProductById(productId) {
            const product = await this.dao.findOne({ _id: productId });
            if (!product) {
                CustomErrors.createError({
                    name: "Find product failed",
                    cause: productNotFound(productId),
                    message: "Error trying to find a single product",
                    code: ErrorEnum.PRODUCT_NOT_FOUND,
                });
            }
            return product;
    }

    async addProduct(productData) {
        try {
            const newProduct = await this.dao.create(productData);
            if (!newProduct.title || !newProduct.description || !newProduct.category || !newProduct.code || !newProduct.stock || !newProduct.thumbnail || !newProduct.price) {
                CustomErrors.createError({
                    name: "Product creation fails",
                    cause: generateProductErrorInfo(newProduct),
                    message: "Error trying to create product",
                    code: ErrorEnum.INVALID_TYPE_ERROR
                });
            }
            return newProduct;
        } catch (error) {
            console.log('Error al agregar el producto');
        }
    }

    async updateProduct(productId, updateData) {
        try {
            const updatedProduct = await this.dao.findByIdAndUpdate(productId, updateData, { new: true });
            return updatedProduct;
        } catch (error) {
            console.log('Error al actualizar el producto');
        }
    }

    async deleteProduct(productId) {
        try {
            await this.dao.findByIdAndDelete(productId);
        } catch (error) {
            console.log('Error al eliminar el producto');
        }
    }
}
