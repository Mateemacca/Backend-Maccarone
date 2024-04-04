import ProductRepository from "../dao/repositories/product.repository.js";
import productModel from "../dao/models/products.model.js";
import { generateProduct } from "../utils/faker.js";
export const productsService = new ProductRepository(productModel);
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, query = "", sort = "" } = req.query;
    const [code, value] = query.split(":");
    const products = await productsService.getProducts(
      limit,
      page,
      code,
      value,
      sort
    );
    res.send({ status: "success", ...products });
  } catch (error) {
    res.status(400).send({ error: "Error al obtener los productos" });
    req.logger.error("Error al obtener productos");
    console.log(error);
  }
};

export const getProductById = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productsService.getProductById(pid);
    if (product) {
      req.logger.info("Producto por ID encontrado!");
      res.send(product);
    } else {
      req.logger.error("Producto no encontrado");
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    req.logger.error("Error al buscar el producto");
    res.status(400).send({ error: "Error al obtener el producto" });
  }
};

export const addProduct = async (req, res) => {
  const { title, description, price, category } = req.body;

  const userEmail = req.user ? req.user.email : null;

  const owner = userEmail ? userEmail : "admin";

  const userRole = req.user ? req.user.role : "admin";
  if (userRole !== "premium" && userRole !== "admin") {
    req.logger.error("Solo los usuarios premium pueden agregar productos.");
    return res
      .status(403)
      .json({ error: "Solo los usuarios premium pueden agregar productos." });
  }

  try {
    const newProduct = await productsService.addProduct({
      title,
      description,
      price,
      category,
      owner,
    });
    res.status(201).json(newProduct);
    req.logger.info("Producto agregado creado con éxito!");
  } catch (error) {
    req.logger.error("Error al crear el producto:", error);
    res.status(400).send({ error: "Error al agregar el producto" });
  }
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const updatedProduct = await productsService.updateProduct(pid, req.body);
    if (updatedProduct) {
      req.logger.info("Producto actualizado con exito");
      res.send({ message: "Producto actualizado" });
    } else {
      req.logger.error("Producto no encontrado");
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    req.logger.error("Error al actualizar el producto");
    res.status(400).send({ error: "Error al actualizar el producto" });
    console.error(error);
  }
};

export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  const userRole = req.session.user.role;

  try {
    const product = await productsService.getProductById(pid);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // verificar si es admin
    if (userRole === "admin") {
      await productsService.deleteProduct(pid);
      req.logger.info("Producto eliminado con éxito por el administrador");
      return res.status(200).json({ message: "Product deleted successfully" });
    }

    //  verificar si es owner del producto y si es premium
    if (
      userRole === "premium" &&
      product.owner.toString() === req.session.user._id.toString()
    ) {
      await productsService.deleteProduct(pid);
      req.logger.info("Producto eliminado con éxito por el usuario premium");
      return res.status(200).json({ message: "Product deleted successfully" });
    }

    // Si el usuario no tiene los permisos necesarios
    req.logger.error("El usuario no tiene permisos para eliminar el producto");
    return res.status(403).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    req.logger.error("Error al eliminar el producto");
    return res.status(400).send({ error: "Error al eliminar el producto" });
  }
};

export const mockedProducts = async (req, res) => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push(generateProduct());
  }
  res.send({ status: "success", payload: users });
};
