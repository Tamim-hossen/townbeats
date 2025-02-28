import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type : String, required: true, ref:"user"},
    _id: { type : String, required: true, ref:"product"},
    name:{ type : String, required: true},
    price:{ type : Number, required: true},
    offerPrice:{ type : Number, required: false},
    image:{ type : Array, required: true},
    selectedColor:{ type : String, required: true},
    selectedSize:{ type : String, required: true},
    category:{ type : String, required: true},
})


const CartItem = mongoose.models.product || mongoose.model('product',productSchema)

export default CartItem