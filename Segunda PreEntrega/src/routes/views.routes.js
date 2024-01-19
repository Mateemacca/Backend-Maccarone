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

viewsRouter.get('/products', async (req,res)=>{
    
    try {
        const {limit = 10, page = 1, query = '', sort = '' } = req.query;
        const [code,value] = query.split(':')
        console.log({[code]: value})
        const products = await productModel.paginate({[code]: value}, {
             limit,
             page,
             sort : sort ? {price:sort} : {} 
            });
            if(products)
            products.payload = products.docs
            delete products.docs
            
            res.render('products', products)
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener los productos' });
        console.log(error)
    }
    
})

viewsRouter.get('/chat', async (req, res) => {
      res.render('chat');
});





export default viewsRouter