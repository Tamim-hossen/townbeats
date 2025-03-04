import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const{userId} = getAuth(request)
        const{_id} = await request.json()
        await connectDB()

        const order = await Order.findById(_id)
        if(order.status === 'Order Placed'){
            order.status = 'Order Confirmed'
        }
        else if(order.status === 'Order Confirmed'){
            order.status = 'Order Processed'
        }
        else if(order.status === 'Order Processed'){
            order.status = 'Order Shipped'
        }
        else if(order.status === 'Order Shipped'){
            order.status = 'Delivered'
        }
        order.save()

        return NextResponse.json({success:true})
    } catch (error) {
        return NextResponse.json({success:false, message: error.message})
    }
}
