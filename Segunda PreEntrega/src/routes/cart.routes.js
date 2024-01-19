import mongoose from 'mongoose'
import { Router } from "express";

const cartRouter = Router()
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
cartRouter.get('/', async (req, res) => {
  try {
      const allCarts = await cartModel.find();
      res.send(allCarts);
  } catch (error) {
      console.error('Error al obtener todos los carritos:', error);
      res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});


cartRouter.post('/', async (req, res) => {
  try {
      const newCart = await cartModel.create({ products: [] });
      res.send({newCart});
  } catch (error) {
      res.send({ error});
  }
});

  
cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findOne({ _id: cid }).populate('products.product');
    if (cart) {
      res.render('cart', { cart }); 
    } else {
      res.send({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.send({ error: 'Error al obtener el carrito' });
  }
});
  
cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = 1;

  try {
    const cart = await cartModel.findOne({ _id: cid });

    if (cart) {
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === pid
      );

      const product = await productModel.findOne({ _id: pid });

      if (existingProduct) {

        existingProduct.quantity += quantity;
      } else if (product) {

        cart.products.push({ product: pid, quantity });
      } else {
        res.status(404).send({ error: 'Producto no encontrado' });
        return;
      }
      await cart.save();
     
      res.send(cart);
    } else {
      res.status(404).send({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Error'});
  }
});
cartRouter.delete('/:cid', async (req, res) => {
  const {cid} = req.params;
  try {
     const deleted = await deleteAllProductsInCart(cid)
     if(deleted === true){
      return res.status(200).send({message:'Productos eliminados correctamente'})
     }else{
      return res.status(500).send({message:'No se pudo eliminar los elementos del carrito'})
     }
  } catch (error) {
      res.send({ error: 'Error al obtener el carrito' });
      console.log(error)
  }
});
 

async function deleteAllProductsInCart(id){
  try {
    const deleted = await cartModel.updateOne({_id:id},{
      products: []
    })
    if(deleted.modifiedCount > 0){
      return true
    }else{
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
      const result = await deleteProductInCart(cid, pid);

      if (result) {
          res.send({ message: 'Producto eliminado del carrito exitosamente' });
      } else {
          res.status(404).send({ error: 'Producto no encontrado en el carrito' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error al eliminar el producto del carrito' });
  }
});




async function deleteProductInCart(cartId, productId) {
  try {
      const result = await cartModel.updateOne(
          { _id: cartId },
          {
              $pull: { products: { product: new mongoose.Types.ObjectId(productId) } }
          }
      );

      if (result.modifiedCount > 0) {
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error(error);
      return false;
  }
}

cartRouter.put('/:cid', async (req,res)=>{
  const {cid} = req.params;
  const cart = req.body;

  try {
    const result = await updateCart(cid, cart)
    if(result.modifiedCount >0){
      res.send({message:'Carrito actualizado'})
    }else{
      res.status(400).send({message:'No se pudo actualizar el carrito'})
    }
  } catch (error) {
    console.error(error)
    res.status(400).send({message:'No se pudo actualizar el carrito'})
  }
})

async function updateCart(cid, cart) {
  try {
    const result = await cartModel.updateOne({_id:cid},cart);
    return result
  } catch (error) {
    console.error(error)
    return error
  }
}



cartRouter.put('/:cid/products/:pid', async (req, res) => {
  const { cid,pid } = req.params;
  const {quantity} = req.body
  const result = await updateProductInCart(cid, pid, quantity)
  if(result === true){
    res.send({message:'Producto Actualizado'})
  }else{
    res.status(400).send({message:'No se pudo actualizar el producto'})
  }
})

async function updateProductInCart(cid,pid,quantity){
  if(!quantity){
    return false
  }
  try {
    const cart = await cartModel.findOne({_id:cid})
    if(!cart){
      return false
    }
      const product = cart.products.find(product=>product.product.toString()=== pid)
      if(!product){
        return false
      }
      product.quantity = quantity
      await cart.save()
      return true
    
  } catch (error) {
    console.log(error)
    return false
  }
}

export default cartRouter;