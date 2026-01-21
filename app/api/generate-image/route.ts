import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Use Pollinations.ai for free, fast generation
        const encodedPrompt = encodeURIComponent(prompt);
        // Random seed to prevent caching
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=512&height=512&nologo=true`;

        // Verify the image exists/works by fetching it (optional, but good for validation)
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) {
            throw new Error("Failed to generate image from provider");
        }

        // We can return the URL directly, or blob it. 
        // Returning the URL is faster.
        return NextResponse.json({
            success: true,
            imageUrl: imageUrl
        });

    } catch (error: any) {
        console.error("Image Gen Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate image" },
            { status: 500 }
        );
    }
}
