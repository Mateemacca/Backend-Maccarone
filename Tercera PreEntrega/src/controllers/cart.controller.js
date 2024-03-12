import cartModel from '../dao/models/carts.model.js'
import CartRepository from '../dao/repositories/cart.repository.js';
import TicketRepository from '../dao/repositories/ticket.repository.js';
const cartRepository = new CartRepository(cartModel);
const ticketRepository = new TicketRepository();

export const getAllCarts = async (req, res) => {
  const allCarts = await cartRepository.getAllCarts();
  res.send(allCarts);
};

export const createCart = async (req, res) => {
  const newCart = await cartRepository.createCart();
  res.send({ newCart });
};

export const getCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartRepository.getCartById(cid);
  if (cart) {
    res.render('cart', { cart });
  } else {
    res.send({ error: 'Carrito no encontrado' });
  }
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartRepository.addProductToCart(cid, pid);
  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send({ error: 'Error al agregar producto al carrito' });
  }
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;
  const deleted = await cartRepository.deleteCart(cid);
  if (deleted === true) {
    res.status(200).send({ message: 'Productos eliminados correctamente' });
  } else {
    res.status(500).send({ message: 'No se pudo eliminar los elementos del carrito' });
  }
};

export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const result = await cartRepository.deleteProductFromCart(cid, pid);
  if (result) {
    res.send({ message: 'Producto eliminado del carrito exitosamente' });
  } else {
    res.status(404).send({ error: 'Producto no encontrado en el carrito' });
  }
};

export const updateOneCart = async (req, res) => {
  const { cid } = req.params;
  const cart = req.body;
  const result = await cartRepository.updateCart(cid, cart);
  if (result.modifiedCount > 0) {
    res.send({ message: 'Carrito actualizado' });
  } else {
    res.status(400).send({ message: 'No se pudo actualizar el carrito' });
  }
};

export const updateOneProductInCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = await cartRepository.updateProductInCart(cid, pid, quantity);
  if (result === true) {
    res.send({ message: 'Producto Actualizado' });
  } else {
    res.status(400).send({ message: 'No se pudo actualizar el producto' });
  }
};

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const result = await ticketRepository.processCartPurchase(cid, req.user.email);
  res.json(result);
};