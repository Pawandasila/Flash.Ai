import { NextResponse } from "next/server";
import { chatSession } from "../../../../Ai/AiModel";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await chatSession.sendMessage(prompt);
    const res = result.response.text();

    return NextResponse.json({ result: res });
  } catch (error) {
    console.error("Error processing chat request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process request", details: errorMessage },
      { status: 500 }
    );
  }
}
