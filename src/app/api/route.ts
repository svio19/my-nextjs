// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Type for request body
interface ChatRequest {
  message: string;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message }: ChatRequest = await req.json();

    // Validate request body
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message must be a non-empty string' },
        { status: 400 }
      );
    }

    // Call Anthropic API
    const completion = await anthropic.messages.create({
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }],
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      system: "You are a helpful AI assistant.", // Customize as needed
    });

    // Extract and validate response content
    const messageContent = completion.content.find(c => c.type === 'text');
    
    if (!messageContent || messageContent.type !== 'text') {
      return NextResponse.json(
        { error: 'Invalid response format from Anthropic API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: messageContent.text,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: 'Anthropic API error', details: error.message },
        { status: error.status || 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Generic error handler
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add rate limiting
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};