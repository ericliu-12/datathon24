import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const userInput = data.userInput;

  const response = await fetch("http://127.0.0.1:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userInput }),
  });

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data);
  } else {
    console.error("Failed to fetch:", response.status, response.statusText);
  }
}
