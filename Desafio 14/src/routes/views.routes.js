import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import { productsService } from "../controllers/products.controller.js";
import {
  checkAuth,
  checkExistingUser,
  validateAdminCredentials,
} from "../middlewares/auth.js";
import cartModel from "../dao/models/carts.model.js";
import CartRepository from "../dao/repositories/cart.repository.js";

const cartRepository = new CartRepository(cartModel);

const viewsRouter = Router();

viewsRouter.get("/", checkAuth, async (req, res) => {
  const { user } = req.session;
  res.render("home", { user });
});

viewsRouter.get("/products", checkAuth, async (req, res) => {
  try {
    const { user } = req.session;
    const { limit = 10, page = 1, query = "", sort = "" } = req.query;
    const [code, value] = query.split(":");
    console.log({ [code]: value });
    const products = await productsService.getProducts(
      limit,
      page,
      code,
      value,
      sort
    );
    if (products) products.payload = products.docs;
    delete products.docs;

    res.render("products", { products, user });
  } catch (error) {
    res.status(400).send({ error: "Error al obtener los productos" });
    console.log(error);
  }
});

viewsRouter.get("/chat", checkAuth, async (req, res) => {
  res.render("chat");
});

viewsRouter.get("/login", checkExistingUser, (req, res) => {
  res.render("login");
});
viewsRouter.get("/register", checkExistingUser, (req, res) => {
  res.render("register");
});
viewsRouter.get("/login", validateAdminCredentials, (req, res) => {
  req.session.user = { role: "admin" };
  res.redirect("/products");
});
viewsRouter.get("/restore-password", checkExistingUser, (req, res) => {
  res.render("restore-password");
});

viewsRouter.get("/faillogin", (req, res) => {
  res.render("faillogin");
});

viewsRouter.get("/failregister", (req, res) => {
  res.render("failregister");
});
viewsRouter.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});
viewsRouter.get("/change-role", (req, res) => {
  const userId = req.user.id;
  // console.log(user);
  res.render("change-role", { userId });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.getCartById(cid);
    res.render("cart", { cart });
  } catch (error) {
    res.status(400).send({ error: "Error al obtener el carrito" });
    console.log(error);
  }
});

export default viewsRouter;
