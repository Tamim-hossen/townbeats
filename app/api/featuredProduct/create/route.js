import connectDB from "@/config/db";
import featuredProduct from "@/models/Featured";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const {featureData} = await request.json()

        await connectDB()

        const featured = await featuredProduct.create({...featureData,userId})

        return NextResponse.json({success:true, message:'Item Added to featured Successfully', featured})
    } catch (error) {
        return NextResponse.json({success:false, message: error.message})
    }
}