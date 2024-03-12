import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.routes.js'
import session from 'express-session'
import FileStore from 'session-file-store'
import sessionRoutes from './routes/session.routes.js';
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js'; 
import cartRouter from './routes/cart.routes.js';  
import passport from 'passport'
import messageModel from './dao/models/messages.model.js';
import initializePassport from './config/passport.config.js'
import config from './config/config.js'

const app = express()
const fileStore = FileStore(session);
const PORT = config.port

app.use(express.static('public'))
app.use(express.urlencoded({ extended:true}))
app.use(express.json())

app.use(session({
  secret: config.secret,
  store: MongoStore.create({
      mongoUrl:config.mongoUrl
  }),
  resave: true,
  saveUninitialized:true,
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
const hbs = handlebars.create({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true
  },
  helpers: {
      if_eq: function(a, b, opts) {
          if (a === b) {
              return opts.fn(this);
          } else {
              return opts.inverse(this);
          }
      }
  }
});



app.engine('handlebars',hbs.engine)
app.set('views','src/views')
app.set('view engine','handlebars')
mongoose.connect(config.mongoUrl)


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/',viewsRouter)
app.use('/api/session', sessionRoutes);

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

