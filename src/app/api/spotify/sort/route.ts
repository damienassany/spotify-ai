import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Return a JSON response
  return NextResponse.json({ message: "Sort liked songs" });
}
