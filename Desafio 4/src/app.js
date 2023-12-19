import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.routes.js'
import ProductManager from './ProductManager.js'
const productManager = new ProductManager('./productos.json');
const app = express()
const PORT = 8080

app.use(express.static('public'))
app.use(express.urlencoded({ extended:true}))
app.use(express.json())

app.engine('handlebars',handlebars.engine())
app.set('views','src/views')
app.set('view engine','handlebars')
app.use('/',viewsRouter)


const httpServer = app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})


const io = new Server(httpServer)

io.on('connection', socket => {
    console.log('Usuario conectado');
    sendProductsBySocket(socket);
});
const sendProductsBySocket = async (io) => {
    try {
        const productos = await productManager.getProducts();
        io.emit('obtenerProductosWebSocket', productos);
    } catch (error) {
        console.log('Error al obtener productos con Web socket' + error);
    }
};
