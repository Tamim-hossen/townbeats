import connectDB from "@/config/db";
import CartItem from "@/models/CartItem";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const {userId} = getAuth(request);
        let CartData;
    try {
      CartData = await request.json(); // Parse the incoming request
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid Data' });
    }
        console.log(CartData)
        await connectDB()

        const newCartItem = await CartItem.create({...CartData,userId})

        if(CartData){
            return NextResponse.json({success:true, message:'Item Added to cart Successfully'},newCartItem)
        }
        
    } catch (error) {
        return NextResponse.json({success:false, message: error.message})
    }
}