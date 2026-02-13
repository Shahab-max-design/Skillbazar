import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
        return NextResponse.json(
            { success: false, message: "Unauthorized. Please login first." },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        return NextResponse.json({
            success: true,
            message: "Technician hired successfully.",
            data: body
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid request body." },
            { status: 400 }
        );
    }
}
