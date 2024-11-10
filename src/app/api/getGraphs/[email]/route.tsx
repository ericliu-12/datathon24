import Graph from "@/lib/GraphSchema";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { email } = await params;
  await connectDB();

  try {
    const graphs = await Graph.find({ email: email }, "data");

    if (graphs && graphs.length > 0) {
      return NextResponse.json(graphs);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error fetching graphs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
