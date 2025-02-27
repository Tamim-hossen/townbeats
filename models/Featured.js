import mongoose from "mongoose";

const featuredProductSchema = new mongoose.Schema({
    _id:{type:String,required:true,ref:'product'},
    userId: { type : String, required: true, ref:"user"},
    name:{ type : String, required: true},
    description:{ type : String, required: true},
    image:{ type : Array, required: true},

})


const featuredProduct = mongoose.models.featuredProduct || mongoose.model('featuredProduct',featuredProductSchema)

export default featuredProduct