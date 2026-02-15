import { NextRequest } from 'next/server';

/**
 * Mock authentication utility for the backend.
 * In a real application, this would verify a JWT token.
 * For this project, it extracts the identifier (email) from the Bearer token.
 */
export async function getAuthenticatedUser(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    // For our demo, the token is simply the user's email
    if (token && token.includes("@")) {
        return {
            id: token,
            email: token
        };
    }

    // Fallback for "session-token-demo" or other static tokens
    // If we wanted to support more roles, we'd handle them here.
    return null;
}
