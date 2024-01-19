import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.routes.js'
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js'; 
import cartRouter from './routes/cart.routes.js';  
import messageModel from './dao/models/messages.model.js';
const app = express()
const PORT = 8080

app.use(express.static('public'))
app.use(express.urlencoded({ extended:true}))
app.use(express.json())

const hbs = handlebars.create({

  runtimeOptions: {

      allowProtoPropertiesByDefault: true

  }

});
app.engine('handlebars',hbs.engine)
app.set('views','src/views')
app.set('view engine','handlebars')
mongoose.connect('mongodb+srv://matee23:Mateo2007@backendmaccarone.my3y3qu.mongodb.net/ecommerce')


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/',viewsRouter)


const httpServer = app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})


const io = new Server(httpServer)
const messages = [];

io.on('connection', async (socket) => {
  console.log('Usuario conectado');

  try {
    
    const storedMessages = await messageModel.find();
    socket.emit('storedMessages', storedMessages);
  } catch (error) {
    console.error('Error al recuperar los mensajes almacenados:', error);
  }

  socket.on('message', async (data) => {
    try {
      await messageModel.create(data);
      messages.push(data);
      io.emit('messageLogs', [data]);
    } catch (error) {
      console.error('Error al almacenar el nuevo mensaje:', error);
    }
  });

  socket.on('newUser', (user) => {
    io.emit('newConnection', 'Un nuevo usuario se conectó');
    socket.broadcast.emit('notification', user);
  });
});

