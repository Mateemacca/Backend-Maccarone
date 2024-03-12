import { Router } from 'express'
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.controller.js';

import { isAdmin, canManageProducts } from '../middlewares/auth.js';
const productsRouter = Router();

productsRouter.get('/',getProducts);
productsRouter.get('/:pid',getProductById);
productsRouter.post('/', isAdmin, canManageProducts, addProduct);
productsRouter.put('/:pid',  isAdmin, canManageProducts,updateProduct);
productsRouter.delete('/:pid',  isAdmin, canManageProducts,deleteProduct);



export default productsRouter;
