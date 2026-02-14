import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    // Mock security check
    if (!authHeader) {
        return NextResponse.json(
            { success: false, message: "Unauthorized. Please login first." },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { bookingId, technicianId, customerId, ratingValue, reviewText } = body;

        // Validation
        if (!bookingId || !technicianId || !ratingValue) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // In a real application, we would:
        // 1. Save rating to database
        // 2. Update booking status to "rated"
        // 3. Recalculate technician average rating
        // 4. Increment technician review count

        console.log("MOCK DB: Rating saved successfully", {
            bookingId,
            technicianId,
            customerId,
            ratingValue,
            reviewText,
            timestamp: new Date().toISOString()
        });

        const ratingData = {
            ratingValue,
            reviewText,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: "Thank you for your feedback!",
            data: {
                status: "rated",
                newAverageRating: 4.9, // Mock updated rating
                totalReviews: 128,     // Mock updated count
                rating: ratingData
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
