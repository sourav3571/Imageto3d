<<<<<<< HEAD
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 35000; // 35 seconds (as suggested by error)

// Sleep utility
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = INITIAL_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) throw error;

    // Check if it's a rate limit error
    if (error?.status === 429 || error?.message?.includes("429")) {
      console.warn("Rate limit hit. Skipping retries to provide immediate fallback.");
      throw error; // Throw immediately to trigger the main catch block's fallback
    }

    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing API Key");
      return NextResponse.json(
        { error: "Server Error: Missing GOOGLE_GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

=======
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "GOOGLE_GEMINI_API_KEY is not configured in environment variables." 
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
>>>>>>> 10f727a2780857222d81c2d30723026a715452ba
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

<<<<<<< HEAD
    const imageData = await image.arrayBuffer();
    const base64Image = Buffer.from(imageData).toString("base64");

    const prompt = `Analyze this image and generate a 64x64 numeric depth map.
    The output must be a valid JSON object with a single key "depth" containing a flat array of 4096 numbers (64x64).
    Each number should be an integer between 0 (farthest/background) and 10 (nearest/foreground).
    Example: { "depth": [0, 0, 1, 5, ... ] }
    Return ONLY valid JSON.`;

    // Use retry logic
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: image.type || "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.1, // Low temp for structured data
          maxOutputTokens: 16000, // Increased for larger array
        },
      });
    });

    const text = response.text?.trim() || "";

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    // Parse response
    try {
      let cleanJson = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error("No JSON found");

      const rawData = JSON.parse(jsonMatch[0]);

      // Handle potential different response structures
      const depthArray = rawData.depth || rawData.data || rawData;

      if (!Array.isArray(depthArray) || depthArray.length < 100) {
        throw new Error("Invalid depth data received");
      }

      // Normalize to 0-1 range for the frontend
      const normalizedDepth = depthArray.map((val: any) => Math.min(Math.max(Number(val), 0), 10) / 10);

      return NextResponse.json({
        success: true,
        depthMap: normalizedDepth,
        resolution: 64,
      });



    } catch (parseError: any) {
      // Return fallback cube
      return NextResponse.json({
        success: true,
        fallback: true,
        depthMap: new Array(4096).fill(0).map((_, i) => {
          // Simple sphere-like gradient for fallback
          const x = (i % 64) - 32;
          const y = Math.floor(i / 64) - 32;
          const dist = Math.sqrt(x * x + y * y);
          return Math.max(0, (1 - dist / 32));
        }),
        resolution: 64,
        message: "Using fallback mesh",
      });
    }

  } catch (error: any) {
    console.error("API Error:", error);

    // Handle rate limit specifically
    if (error?.status === 429 || error?.message?.includes("429")) {
      return NextResponse.json({
        error: "Rate limit exceeded. Please wait a minute and try again.",
        retryAfter: 60,
        fallback: true,
        depthMap: new Array(4096).fill(0).map((_, i) => Math.max(0, 1 - Math.sqrt(Math.pow((i % 64) - 32, 2) + Math.pow(Math.floor(i / 64) - 32, 2)) / 32)),
        resolution: 64,
      }, { status: 200 });
    }


    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

function generateFallbackMesh() {
  // Generate a more interesting shape than a cube
  const vertices: number[] = [];
  const faces: number[] = [];

  // Create a simple house shape
  const s = 1; // size

  // Base vertices (cube bottom)
  vertices.push(
    -s, 0, -s,  // 0
    s, 0, -s,  // 1
    s, 0, s,  // 2
    -s, 0, s,  // 3
    -s, s, -s,  // 4
    s, s, -s,  // 5
    s, s, s,  // 6
    -s, s, s,  // 7
    0, s * 1.5, 0, // 8 - roof peak
  );

  // Faces
  faces.push(
    // Bottom
    0, 2, 1, 0, 3, 2,
    // Front
    0, 1, 5, 0, 5, 4,
    // Right
    1, 2, 6, 1, 6, 5,
    // Back
    2, 3, 7, 2, 7, 6,
    // Left
    3, 0, 4, 3, 4, 7,
    // Roof
    4, 5, 8,
    5, 6, 8,
    6, 7, 8,
    7, 4, 8,
  );

  return { vertices, faces };
}
=======
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageData = await image.arrayBuffer();
    const base64Image = Buffer.from(imageData).toString("base64");

    const prompt = `
      Analyze this image and estimate the depth of the objects. 
      Return a JSON object with a "depthMap" field.
      The "depthMap" must be a 1D array of exactly 1024 numbers (representing a 32x32 grid).
      Each number should be between 0.0 (background/far) and 1.0 (foreground/near).
      Focus on the main subject.
      Output ONLY the JSON object. No markdown, no explanations.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim();
    
    // More robust JSON extraction
    let jsonStr = text;
    if (text.includes('```')) {
      jsonStr = text.split('```')[1].replace(/^(json)/, '').trim();
    } else {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonStr = text.substring(start, end + 1);
      }
    }

    try {
      const data = JSON.parse(jsonStr);
      if (!data.depthMap || !Array.isArray(data.depthMap)) {
        throw new Error("Invalid response format from AI");
      }

      return NextResponse.json({ 
        depthMap: data.depthMap,
        resolution: 32 // Reduced to 32 for better reliability
      });
    } catch (parseError) {
      console.error("Raw AI Response:", text);
      throw new Error("AI returned invalid JSON data");
    }
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
>>>>>>> 10f727a2780857222d81c2d30723026a715452ba
