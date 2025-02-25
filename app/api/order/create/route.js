import { inngest } from "@/config/inngest";
import  Product from "@/models/product";
import  User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth();
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data" });
        }

        // Fix async reduce issue
        const amounts = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) throw new Error(`Product not found: ${item.product}`);
                return product.price * item.quantity;
            })
        );
        const amount = amounts.reduce((acc, val) => acc + val, 0);

        await inngest.send({
            name: "order/created",
            data: { userId, address, items, amount, date: Date.now() },
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
