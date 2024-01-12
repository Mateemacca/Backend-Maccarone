import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const viewsRouter = Router()


viewsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
    const productos = await productModel.find().lean()
    if (!limit) {
        res.render('home', { productos });
    } else {
        let productosFiltered = limit ? productos.slice(0, +limit) : productos;
        res.render('home', { productos: productosFiltered });
    }
        
    } catch (error) {
        console.log('Error al obtener los productos:', error);
    }
});

viewsRouter.get('/chat', async (req, res) => {
      res.render('chat');
});



export default viewsRouter