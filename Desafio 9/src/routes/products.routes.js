import { Router } from 'express'
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.controller.js';
const productsRouter = Router();

productsRouter.get('/',getProducts);
productsRouter.get('/:pid',getProductById);
productsRouter.post('/',addProduct);
productsRouter.put('/:pid',updateProduct);
productsRouter.delete('/:pid',deleteProduct);



export default productsRouter;
