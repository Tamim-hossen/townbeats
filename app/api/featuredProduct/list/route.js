import connectDB from "@/config/db";
import featuredProduct from "@/models/Featured";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const featuredProducts = await featuredProduct.find({})
        return NextResponse.json({success:true , featuredProducts})
    } catch (error) {
        return NextResponse.json({success:false, message : error.message})
    }
}