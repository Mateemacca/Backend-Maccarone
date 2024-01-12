import mongoose from 'mongoose'
const cartCollection = 'carts'

const cartSchema = mongoose.Schema({
    products:[
        {
          product: { type: mongoose.Schema.Types.ObjectId},
          quantity: Number,
        },
      ],
    });

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;