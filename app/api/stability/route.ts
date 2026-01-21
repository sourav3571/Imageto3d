import { NextRequest, NextResponse } from "next/server";


export const maxDuration = 60; // Stability is fast, but just in case
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.STABILITY_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Server Error: Missing STABILITY_API_KEY in .env.local" },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const image = formData.get("image");

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        console.log("Starting Stability AI task... (v2)");

        // Create a new FormData for the upstream request
        const upstreamFormData = new FormData();
        upstreamFormData.append("image", image);
        upstreamFormData.append("texture_resolution", "1024");
        upstreamFormData.append("foreground_ratio", "0.85");

        const response = await fetch(
            "https://api.stability.ai/v2beta/3d/stable-fast-3d",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                body: upstreamFormData as any, // Cast to any to avoid TS issues with FormData in some environments
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Stability API Error:", errorText);
            return NextResponse.json(
                { error: `Stability AI Error: ${response.status} ${errorText}` },
                { status: response.status }
            );
        }

        // Stability returns the binary GLB directly
        const glbBuffer = await response.arrayBuffer();

        // Return as a binary response with correct content type
        return new NextResponse(glbBuffer, {
            headers: {
                "Content-Type": "model/gltf-binary",
                "Content-Disposition": 'attachment; filename="model.glb"',
            },
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
