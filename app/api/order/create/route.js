import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import  Product from "@/models/product";
import  User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address,address_region, items } = await request.json();
        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data" });
        }

        await connectDB();

        
        let amount = await items.reduce(async (acc,item) => {
            const prod = await Product.findById(item.product)
            return await acc+((prod.offerPrice===0 ? prod.price :prod.offerPrice )*item.quantity)
        }
        ,0);
        

        if(address_region==='Dhaka'){
            amount+=80
        }
        else{
            amount+=150
        }

        
       

        await inngest.send({
            name: "order/created",
            data: { userId, 
                    address, 
                    items, 
                    amount, 
                    date: Date.now() },
        });

        // Clear cart
        const user = await User.findById(userId);
        if (user) {
            user.cartItems = {};
            await user.save();
        }

        return NextResponse.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
