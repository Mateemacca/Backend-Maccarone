import { Router } from 'express'
import productModel from '../dao/models/products.model.js';
const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        const {limit} = req.query;
        const products = await productModel.find();
        if(!limit){
            res.send(products)
        }else {
            const limitedProducts = limit ? products.slice(0, +limit) : products;
            res.send(limitedProducts);
        }
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener los productos' });
    }
});
productsRouter.get('/:pid', async (req, res) => {
  const {pid} = req.params;
  try {
      const product = await productModel.findOne({_id:pid});

      if (product) {
          res.send(product);
      } else {
          res.status(404).send({ error: 'Producto no encontrado' });
      }
  } catch (error) {
      res.status(400).send({ error: 'Error al obtener el producto' });
  }
});
  
productsRouter.post('/', async (req, res) => {
  try {
      const newProduct = await productModel.create(req.body);
      res.status(201).json(newProduct);
  } catch (error) {
      res.status(400).send({ error: 'Error al agregar el producto' });
  }
});
  
productsRouter.put('/:pid', async (req, res) => {
  const {pid} = req.params;
  try {
      const updatedProduct = await productModel.updateOne({_id:pid}, req.body);

      if (updatedProduct) {
          res.send({message:"producto actualizado"});
      } else {
          res.status(404).send({ error: 'Producto no encontrado' });
      }
  } catch (error) {
      res.status(400).send({ error: 'Error al actualizar el producto' });
      console.error(error)
  }
});
  
  
productsRouter.delete('/:pid', async (req, res) => {
  const {pid} = req.params;
  try {
      await productModel.deleteOne({_id:pid})
      res.send({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
      res.status(400).send({ error: 'Error al eliminar el producto' });
  }
});



export default productsRouter;
