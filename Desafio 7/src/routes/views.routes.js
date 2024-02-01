import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import { checkAuth, checkExistingUser,validateAdminCredentials } from "../middlewares/auth.js";
const viewsRouter = Router()


viewsRouter.get('/', checkAuth, async (req, res) => {
    
    try {
        const {user} = req.session;
        const { limit } = req.query;
    const productos = await productModel.find().lean()
    if (!limit) {
        res.render('home',  {user, productos });
    } else {
        let productosFiltered = limit ? productos.slice(0, +limit) : productos;
        res.render('home', {user, productos: productosFiltered });
    }
        
    } catch (error) {
        console.log('Error al obtener los productos:', error);
    }
});

viewsRouter.get('/products',checkAuth, async (req,res)=>{
    
    try {
        const {user} = req.session;
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
            
            res.render('products', {products, user})
    } catch (error) {
        res.status(400).send({ error: 'Error al obtener los productos' });
        console.log(error)
    }
    
})

viewsRouter.get('/chat',checkAuth, async (req, res) => {
      res.render('chat');
});

viewsRouter.get('/login', checkExistingUser, (req, res) => {
    res.render('login');
});
viewsRouter.get('/register', checkExistingUser, (req, res) => {
    res.render('register');
})
viewsRouter.get('/login', validateAdminCredentials, (req, res) => {
    req.session.user = { role: 'admin' };
    res.redirect('/products');
});
viewsRouter.get('/restore-password', checkExistingUser,(req,res)=>{
    res.render('restore-password')
})

viewsRouter.get('/faillogin',(req,res)=>{
    res.render('faillogin')
})

viewsRouter.get('/failregister',(req,res)=>{
    res.render('failregister')
})

export default viewsRouter