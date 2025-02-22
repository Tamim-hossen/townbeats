import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
    console.log("Request Headers:", request.headers);

    try {
        // Extract token from x-clerk-auth-token header
        const authToken = request.headers.get('x-clerk-auth-token');

        if (!authToken) {
            return NextResponse.json({ success: false, message: "No Clerk token found in headers" });
        }

        const { userId } = await getAuth(request);  // Ensure this works with Clerk's latest API

        console.log("UserID from Clerk:", userId);

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        await connectDB();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User Not Found" });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error:", error);  // Log the error for debugging
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
