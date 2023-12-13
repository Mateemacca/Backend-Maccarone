import { Router } from "express";
import CartManager from "../CartManager.js";
const cartRouter = Router()
const cartManager = new CartManager('./carrito.json');

cartRouter.get('/', async (req, res) => {
  try {
    const allCarts = await cartManager.getCarts();
    res.send(allCarts);
  } catch (error) {
    console.error('Error al obtener todos los carritos:', error);
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});


cartRouter.post('/', async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.send(newCart);
    } catch (error) {
      res.send({ error: 'Error al crear el carrito' });
    }
  });
  
  cartRouter.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
      const cart = await cartManager.getCartById(cartId);
      if (cart) {
        res.send(cart.products);
      } else {
        res.send({ error: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.send({ error: 'Error al obtener el carrito' });
    }
  });
  
  cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;  // agregamos de a un solo producto por el momento
    try {
        const updatedCart = await cartManager.addProductToCart(+cartId, +productId, quantity);
        res.send(updatedCart);
    } catch (error) {
        res.send({ error: 'Error al agregar el producto al carrito' });
    }
});

  

  export default cartRouter;