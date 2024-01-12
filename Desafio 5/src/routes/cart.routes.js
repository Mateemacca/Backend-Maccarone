import { Router } from "express";

const cartRouter = Router()
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
cartRouter.get('/', async (req, res) => {
  try {
      const allCarts = await cartModel.find();
      res.send(allCarts);
  } catch (error) {
      console.error('Error al obtener todos los carritos:', error);
      res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});


cartRouter.post('/', async (req, res) => {
  try {
      const newCart = await cartModel.create({ products: [] });
      res.send({newCart});
  } catch (error) {
      res.send({ error});
  }
});

  
 cartRouter.get('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const cart = await cartModel.findOne({_id:cid});
        if (cart) {
            res.send({cart});
        } else {
            res.send({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.send({ error: 'Error al obtener el carrito' });
    }
});
  
cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = 1;

  try {
    const cart = await cartModel.findOne({ _id: cid });

    if (cart) {
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === pid
      );

      const product = await productModel.findOne({ _id: pid });

      if (existingProduct) {

        existingProduct.quantity += quantity;
      } else if (product) {

        cart.products.push({ product: pid, quantity });
      } else {
        res.status(404).send({ error: 'Producto no encontrado' });
        return;
      }
      await cart.save();
     
      res.send(cart);
    } else {
      res.status(404).send({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Error'});
  }
});



  

  export default cartRouter;