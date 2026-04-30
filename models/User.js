import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    cartItems: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false })


const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User