import express from 'express'
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080; 


const productManager = new ProductManager('./productos.json');

app.use(express.urlencoded({extended: true}))
app.get('/products', async (req, res) => {
    try {
        const {limit} = req.query;
        const products = await productManager.getProducts();
        if(!limit){
            res.send(products)
        }else{
        const limitedProducts = limit ? products.slice(0, +limit) : products;
        res.send(limitedProducts);
    }
    } catch (error) {
        res.send({error:'Error al obtener los productos'})
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManager.getProductById(productId);
  
      if (!product) {
        return res.send({ error: 'No existe un producto con ese ID' });
      }
  
      res.send(product);
    } catch (error) {
      res.send({ error: 'Error al obtener producto por ID' });
    }
  });

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
