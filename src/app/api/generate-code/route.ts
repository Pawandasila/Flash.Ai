import { NextResponse } from "next/server";
import { GenAiCode } from "../../../../Ai/AiModel";

interface CodeGenerationRequest {
  prompt: string;
  framework?: string;
  language?: string;
  features?: string[];
  projectType?: string;
}

interface CodeGenerationResponse {
  projectTitle: string;
  framework: string;
  language: string;
  explanation: string;
  features: string[];
  files: Record<string, { code: string }>;
  generatedFiles: string[];
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  envVariables?: string[];
  apiEndpoints?: string[];
}

export async function POST(req: Request) {
  try {
    const { prompt, framework, language, features, projectType }: CodeGenerationRequest = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Enhanced prompt with additional context
    let enhancedPrompt = prompt;

    if (framework) {
      enhancedPrompt += `\n\nFramework: ${framework}`;
    }

    if (language) {
      enhancedPrompt += `\nLanguage: ${language}`;
    }

    if (features && features.length > 0) {
      enhancedPrompt += `\nRequired Features: ${features.join(', ')}`;
    }

    if (projectType) {
      enhancedPrompt += `\nProject Type: ${projectType}`;
    }

    // Add specific instructions for better code generation
    enhancedPrompt += `\n\nAdditional Requirements:
- Include proper error handling and loading states
- Add responsive design with mobile-first approach
- Include proper TypeScript types if using TypeScript
- Add proper file organization and folder structure
- Include comments for complex logic
- Use modern ES6+ features and best practices
- Add proper validation and sanitization
- Include proper SEO meta tags for web projects
- Implement proper state management patterns`;

    const result = await GenAiCode.sendMessage(enhancedPrompt);
    const responseText = await result.response.text();

    if (!responseText?.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI model" },
        { status: 500 }
      );
    }

    let responseJson: CodeGenerationResponse;
    try {
      // Clean the response text to handle potential formatting issues
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      responseJson = JSON.parse(cleanedText);
      
      // Validate required fields
      if (!responseJson.files || Object.keys(responseJson.files).length === 0) {
        throw new Error('No files generated');
      }

      // Ensure all required fields are present
      responseJson = {
        projectTitle: responseJson.projectTitle || "Generated Project",
        framework: responseJson.framework || framework || "react",
        language: responseJson.language || language || "javascript",
        explanation: responseJson.explanation || "A generated project",
        features: responseJson.features || [],
        files: responseJson.files,
        generatedFiles: responseJson.generatedFiles || Object.keys(responseJson.files),
        dependencies: responseJson.dependencies || {},
        scripts: responseJson.scripts || {},
        envVariables: responseJson.envVariables || [],
        apiEndpoints: responseJson.apiEndpoints || []
      };

    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", responseText);
      
      return NextResponse.json(
        { 
          error: "Failed to parse AI response", 
          details: process.env.NODE_ENV === 'development' ? responseText : "Invalid response format",
          rawResponse: process.env.NODE_ENV === 'development' ? responseText : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(responseJson);

  } catch (error) {
    console.error("AI Code Generation Error:", error);
    
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
        error: "Failed to process AI request", 
        details: process.env.NODE_ENV === 'development' ? error : "Internal server error"
      },
      { status: 500 }
    );
  }
}
