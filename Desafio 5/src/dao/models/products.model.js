import  mongoose  from "mongoose";
const productsCollection = 'products'

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    stock:{
        type:Number,
        required: true,
        default:1
    },
    category:{
        type:String,
        required:true
    },
    thumbnails: [{
        type: String,
        required: true,
    }],
});

const productModel = mongoose.model(productsCollection, productSchema);
export default productModel;