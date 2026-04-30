import { NextResponse } from "next/server";

// Inngest has been disabled - using direct database operations instead
export async function GET() {
  return NextResponse.json({ message: "Inngest endpoint disabled" }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ message: "Inngest endpoint disabled" }, { status: 200 });
}

export async function PUT() {
  return NextResponse.json({ message: "Inngest endpoint disabled" }, { status: 200 });
}
