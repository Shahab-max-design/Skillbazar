import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { bookingId: string } }
) {
    const bookingId = params.bookingId;

    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // In a real app, we would query the DB. 
    // For this mock, we'll return a sample if the ID exists in our dummy list.
    // However, since we use localStorage on the frontend, this API is mainly for 
    // structure and potential future backend integration.

    return NextResponse.json({
        success: true,
        data: {
            ratingValue: 4.5,
            reviewText: "Excellent service, very professional and punctual. Highly recommended!",
            createdAt: new Date().toISOString()
        }
    });
}
