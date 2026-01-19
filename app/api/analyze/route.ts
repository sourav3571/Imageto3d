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
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

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
