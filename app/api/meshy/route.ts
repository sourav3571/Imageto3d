import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow longer timeout for initial request

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.MESHY_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Server Error: Missing MESHY_API_KEY in .env.local" },
                { status: 500 }
            );
        }

        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        // 1. Start the Task
        console.log("Starting Meshy task for:", imageUrl);
        const startRes = await fetch("https://api.meshy.ai/openapi/v1/image-to-3d", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url: imageUrl,
                enable_pbr: true,
            }),
        });

        const startData = await startRes.json();

        if (!startRes.ok) {
            console.error("Meshy Start Error:", startData);
            return NextResponse.json(
                { error: startData.message || "Failed to start generation" },
                { status: startRes.status }
            );
        }

        const taskId = startData.result;
        console.log("Task started, ID:", taskId);

        // 2. Poll for completion (Simple polling for MVP)
        // In a real production app, use webhooks or client-side polling. 
        // Here we'll do a quick loop to wait for at least the 'preview' which is fast, 
        // or return the task ID to the frontend to poll.
        // Returning Task ID is safer for Edge functions.

        return NextResponse.json({
            success: true,
            taskId: taskId,
            status: "PENDING"
        });

    } catch (error: any) {
        console.error("Meshy API Error:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}

// Separate GET endpoint to check status
export async function GET(req: NextRequest) {
    const apiKey = process.env.MESHY_API_KEY;
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) return NextResponse.json({ error: "No taskId" }, { status: 400 });

    try {
        const res = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
            headers: { "Authorization": `Bearer ${apiKey}` },
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
