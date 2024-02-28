import mongoose from "mongoose";
const { Schema } = mongoose;
const userCollection = 'users';

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
         type: Schema.Types.ObjectId,
          ref: 'cart' 
        },

    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    }
});

export const userModel = mongoose.model(userCollection, userSchema);