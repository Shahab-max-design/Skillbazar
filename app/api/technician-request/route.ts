import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/backend-db";
import { getAuthenticatedUser } from "@/lib/backend-auth";

export async function POST(request: NextRequest) {
    console.log("Route hit");
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized. Please login first." },
            { status: 401 }
        );
    }

    const customerId = user.id;
    console.log("Saving Request With Customer ID:", customerId);

    try {
        const formData = await request.formData();

        // Log keys for debugging
        const keys = Array.from(formData.keys());
        console.log("Request Body Keys:", keys);
        const body = Object.fromEntries(formData.entries());
        console.log("Request Body:", body);
        const technicianId = formData.get("technician_id") as string;
        const technicianName = formData.get("technician_name") as string;
        const technicianImage = formData.get("technician_image") as string;
        const serviceRequired = formData.get("service_required") as string;
        const problemDescription = formData.get("description") as string;
        const address = formData.get("address") as string;
        const preferredDate = formData.get("preferred_date") as string;
        const budget = formData.get("budget") as string;
        const image = formData.get("image") as File | null;

        if (!technicianId) {
            return NextResponse.json(
                { success: false, message: "Technician ID (technician_id) is required." },
                { status: 400 }
            );
        }

        // 1. Duplicate Check using persistent DB
        const existingRequests = db.getTechnicianRequests(customerId);
        const existingRequest = existingRequests.find(
            (req: any) =>
                String(req.technicianId) === String(technicianId) &&
                req.status === "pending"
        );

        if (existingRequest) {
            return NextResponse.json(
                { success: false, message: "Request already sent to this technician" },
                { status: 400 }
            );
        }

        // 2. Insert Into DB
        const newRequest = {
            id: `req-${Date.now()}`,
            customer_id: customerId,
            technician_id: technicianId,
            technician_name: technicianName,
            technician_image: technicianImage,
            service_required: serviceRequired,
            description: problemDescription,
            address: address,
            preferred_date: preferredDate,
            budget: budget,
            status: "pending",
            image_name: image ? image.name : null,
            image_size: image ? image.size : null,
            created_at: new Date().toISOString()
        };

        db.addTechnicianRequest(newRequest);
        console.log("Inserted Successfully:", newRequest);

        return NextResponse.json({
            success: true,
            message: "Service request submitted successfully.",
            data: newRequest
        });

    } catch (error) {
        console.error("Error processing technician request:", error);
        return NextResponse.json(
            { success: false, message: "Invalid request body." },
            { status: 400 }
        );
    }
}

// GET handler to view requests (for debugging/verification if needed)
export async function GET() {
    const data = db.getTechnicianRequests();
    return NextResponse.json({
        success: true,
        count: data.length,
        data: data
    });
}
