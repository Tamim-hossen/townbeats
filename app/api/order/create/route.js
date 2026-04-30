import connectDB from "@/config/db";
import Product from "@/models/product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, address_region, items, amountsent } = await request.json();
        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data" });
        }

        await connectDB();

        let amount = amountsent;
        
        if(address_region === 'Dhaka'){
            amount += 80
        }
        else{
            amount += 150
        }

        // Create order directly in database
        const newOrder = await Order.create({
            userId,
            address,
            items,
            amount,
            date: Date.now()
        });

        // Clear cart
        const user = await User.findById(userId);
        if (user) {
            user.cartItems = {};
            await user.save();
        }

        return NextResponse.json({ success: true, message: "Order Placed", orderId: newOrder._id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
