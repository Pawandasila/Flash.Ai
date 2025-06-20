import { NextResponse } from "next/server";
import { chatSession } from "../../../../Ai/AiModel";

export async function POST(req: Request) {
  try {
    const { prompt, context, conversationHistory } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Enhanced prompt with context and conversation history
    let enhancedPrompt = prompt;
    
    if (context) {
      enhancedPrompt = `Context: ${context}\n\nUser Request: ${prompt}`;
    }

    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5); // Last 5 messages for context
      const historyText = recentHistory
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join('\n');
      enhancedPrompt = `Previous conversation:\n${historyText}\n\nCurrent request: ${prompt}`;
    }

    const result = await chatSession.sendMessage(enhancedPrompt);
    const response = result.response.text();

    if (!response?.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI model" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      result: response,
      tokens: response.split(' ').length, // Rough token estimation
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error processing chat request:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: "API quota exceeded. Please try again later." },
          { status: 429 }
        );
      }
      
      if (error.message.includes('safety')) {
        return NextResponse.json(
          { error: "Content filtered for safety reasons. Please rephrase your request." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Failed to process request", 
        details: process.env.NODE_ENV === 'development' ? error : "Internal server error"
      },
      { status: 500 }
    );
  }
}
