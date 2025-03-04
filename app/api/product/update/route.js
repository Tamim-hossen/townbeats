import connectDB from "@/config/db";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { Data } = await request.json(); 

        await connectDB(); 
        // console.log("Updated Data:", Data);

        for (const updatedProduct of Data) {
            const product = await Product.findOne({ _id: updatedProduct._id });
console.log(product)
            if (product) {
                product.colors = updatedProduct.colors;
                await product.save();
                console.log(product)
            } else {
                return NextResponse.json({ success: false, message: "Product not found for ID: " + updatedProduct._id });
            }
        }
        return NextResponse.json({ success: true, message: "Products updated successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
