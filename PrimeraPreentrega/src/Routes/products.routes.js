import { Router } from 'express'
const productsRouter = Router();
import ProductManager from '../ProductManager.js';
const productManager = new ProductManager('./productos.json');

productsRouter.get('/', async (req, res) => {
    try {
        const {limit} = req.query;
        const products = await productManager.getProducts();
        if(!limit){
            res.send(products)
        }else{
        const limitedProducts = limit ? products.slice(0, +limit) : products;
        res.send(limitedProducts);
    }
    } catch (error)  {
        res.send({error:'Error al obtener los productos'})
    }
});
productsRouter.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await productManager.getProductById(+productId);
      if (product) {
        res.send(product);
      } else {
        res.send({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.send({ error: 'Error al obtener el producto' });
    }
  });
  
  productsRouter.post('/', async (req, res) => {
    try {
      const newProduct = await productManager.addProduct(req.body);
      res.send(newProduct);
    } catch (error) {
      res.send({ error: 'Error al agregar el producto' });
    }
  });
  
  productsRouter.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      const updatedProduct = await productManager.updateProduct(productId, req.body);
  
      if (updatedProduct) {
        res.send(updatedProduct);
      } else {
        res.send({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.send({ error: 'Error al actualizar el producto' });
    }
  });
  
  
  productsRouter.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      await productManager.deleteProduct(+productId);
      res.send({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.send({ error: 'Error al eliminar el producto' });
    }
  });



export default productsRouter;
