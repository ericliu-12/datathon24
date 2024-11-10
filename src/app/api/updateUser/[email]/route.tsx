import Graph from "@/lib/GraphSchema";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { email } = await params;
  const response = await req.json();

  await connectDB();

  try {
    const existingData = await Graph.findOne({ email: email });

    if (existingData) {
      existingData.data.push(response);
      await existingData.save();

      return NextResponse.json(existingData);
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
