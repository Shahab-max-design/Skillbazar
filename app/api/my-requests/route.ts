import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/backend-db";
import { getAuthenticatedUser } from "@/lib/backend-auth";

export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized. Please login first." },
            { status: 401 }
        );
    }

    const customerId = user.id;
    console.log("Fetching for customer:", customerId);

    try {
        const technicianRequests = db.getTechnicianRequests(customerId);
        const freelancerOrders = db.getFreelancerOrders(customerId);

        console.log(`Fetched dashboard data for Customer: ${customerId}. Tech: ${technicianRequests.length}, Free: ${freelancerOrders.length}`);

        return NextResponse.json({
            success: true,
            technicianRequests,
            freelancerOrders
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
