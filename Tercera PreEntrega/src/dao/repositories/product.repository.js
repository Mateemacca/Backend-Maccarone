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
        try {
            const product = await this.dao.findOne({ _id: productId });
            return product;
        } catch (error) {
            console.log('Error al obtener el producto');
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = await this.dao.create(productData);
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
