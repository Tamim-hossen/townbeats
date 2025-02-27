import connectDB from "@/config/db";
import featuredProduct from "@/models/Featured";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const {featureData} = await request.json()
        console.log(featureData)
        await connectDB()

        const newAddress = await featuredProduct.create({...featureData,userId})

        return NextResponse.json({success:true, message:'Item Added to featured Successfully', newAddress})
    } catch (error) {
        return NextResponse.json({success:false, message: error.message})
    }
}