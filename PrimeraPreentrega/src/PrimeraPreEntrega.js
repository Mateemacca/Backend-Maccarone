import express from 'express';
import productsRouter from './Routes/products.routes.js'; 
import cartRouter from './Routes/cart.routes.js';  

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
