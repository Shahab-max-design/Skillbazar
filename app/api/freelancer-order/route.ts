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
        const body = Object.fromEntries(formData.entries());
        console.log("Request Body:", body);

        const providerId = formData.get("provider_id") as string;
        const providerName = formData.get("provider_name") as string;
        const providerImage = formData.get("provider_image") as string;
        const serviceTitle = formData.get("service_title") as string;
        const description = formData.get("description") as string;
        const deliveryTime = formData.get("delivery_time") as string;
        const paymentStatus = formData.get("payment_status") as string;
        const amount = formData.get("amount") as string;

        if (!providerId) {
            return NextResponse.json(
                { success: false, message: "Provider ID (provider_id) is required." },
                { status: 400 }
            );
        }

        const newOrder = {
            id: `order-${Date.now()}`,
            customer_id: customerId,
            provider_id: providerId,
            provider_name: providerName,
            provider_image: providerImage,
            service_title: serviceTitle,
            description: description,
            delivery_time: deliveryTime,
            payment_status: paymentStatus,
            amount: parseFloat(amount),
            status: "pending",
            created_at: new Date().toISOString()
        };

        db.addFreelancerOrder(newOrder);
        console.log("Inserted Successfully:", newOrder);

        return NextResponse.json({
            success: true,
            message: "Order placed successfully.",
            data: newOrder
        });

    } catch (error) {
        console.error("Error processing freelancer order:", error);
        return NextResponse.json(
            { success: false, message: "Invalid request body." },
            { status: 400 }
        );
    }
}
