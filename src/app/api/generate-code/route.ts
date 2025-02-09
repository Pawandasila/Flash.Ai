import { NextResponse } from "next/server";
import { GenAiCode } from "../../../../Ai/AiModel";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await GenAiCode.sendMessage(prompt);
    const responseText = await result.response.text();

    let responseJson;
    try {
      responseJson = JSON.parse(responseText); 
    } catch (parseError) {
      responseJson = { rawText: responseText };
    }

    return NextResponse.json(responseJson);
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to process AI request", details: error },
      { status: 500 }
    );
  }
}
