import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Siva Vishnu Temple",
    location: "Livermore, California",
    description: "A spiritual and cultural center dedicated to multiple Hindu traditions.",
    timings: [
      "Daily: 9:00 AM - 12:00 PM",
      "Daily: 5:30 PM - 8:30 PM"
    ],
    contact: "+1 (925) 447-9355"
  });
}
