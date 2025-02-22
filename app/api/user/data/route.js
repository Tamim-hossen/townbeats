import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {


    try {

        const authToken = request.headers.get('x-clerk-auth-token');

        if (!authToken) {
            return NextResponse.json({ success: false, message: "No Clerk token found in headers" });
        }

        const { userId } = getAuth(request);  


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
        console.error("Error:", error);  
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
