import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const{userId} = getAuth(request)
        const{_id,nextStatus} = await request.json()
        await connectDB()

        const order = await Order.findById(_id)
        order.status = nextStatus

        order.save()
        return NextResponse.json({success:true})
    } catch (error) {
        return NextResponse.json({success:false, message: error.message})
    }
}
