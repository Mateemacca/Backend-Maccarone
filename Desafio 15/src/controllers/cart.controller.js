import cartModel from "../dao/models/carts.model.js";
import CartRepository from "../dao/repositories/cart.repository.js";
import TicketRepository from "../dao/repositories/ticket.repository.js";
import { productsService } from "./products.controller.js";
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
    req.logger.info(`Carrito con el id ${cid} encontrado!`);
    // res.render("cart", { cart });
    res.send({ cart });
  } else {
    req.logger.error("Carrito no encontrado");
    res.send({ error: "Carrito no encontrado" });
  }
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartRepository.getCartById(cid);
    const product = await productsService.getProductById(pid);

    if (!cart || !product) {
      return res.status(404).json({ error: "Cart or product not found" });
    }

    // Verificar si el usuario está autenticado
    if (req.session.user && req.session.user.role) {
      // Si el usuario está autenticado, aplicar la verificación normal de propiedad del producto
      const userRole = req.session.user.role;
      if (
        userRole === "premium" &&
        product.owner.toString() === req.session.user._id.toString()
      ) {
        req.logger.error(
          "Usuario premium no puede agregar su propio producto al carrito"
        );
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    // Agregar el producto al carrito
    const updatedCart = await cartRepository.addProductToCart(cid, pid);
    req.logger.info("Producto agregado al carrito con éxito!");
    res.status(200).send(updatedCart);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    req.logger.error("Error al agregar el producto al carrito");
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;
  const deleted = await cartRepository.deleteCart(cid);
  if (deleted === true) {
    req.logger.info("Productos eliminados correctamente!");
    res.status(200).send({ message: "Productos eliminados correctamente" });
  } else {
    req.logger.error("Error al eliminar los productos del carrito");
    res
      .status(500)
      .send({ message: "No se pudo eliminar los elementos del carrito" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const result = await cartRepository.deleteProductFromCart(cid, pid);
  if (result) {
    req.logger.info("Producto eliminado del carrito correctamente!");
    res.send({ message: "Producto eliminado del carrito exitosamente" });
  } else {
    req.logger.error("Error al eliminar producto del carrito");
    res.status(404).send({ error: "Producto no encontrado en el carrito" });
  }
};

export const updateOneCart = async (req, res) => {
  const { cid } = req.params;
  const cart = req.body;
  const result = await cartRepository.updateCart(cid, cart);
  if (result.modifiedCount > 0) {
    req.logger.info("Carrito actualizado con exito!");
    res.send({ message: "Carrito actualizado" });
  } else {
    req.logger.error("Error al actualizar el carrito");
    res.status(400).send({ message: "No se pudo actualizar el carrito" });
  }
};

export const updateOneProductInCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = await cartRepository.updateProductInCart(cid, pid, quantity);
  if (result === true) {
    req.logger.info("Producto del carrito actualizado con exito!");
    res.send({ message: "Producto Actualizado" });
  } else {
    req.logger.error("Error al actualizar producto del carrito");
    res.status(400).send({ message: "No se pudo actualizar el producto" });
  }
};

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const result = await ticketRepository.processCartPurchase(
    cid,
    req.user.email
  );
  req.logger.info("Compra realizada con exito!");
  res.json(result);
};
