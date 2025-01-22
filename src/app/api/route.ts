import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    // Check for API key at runtime
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await anthropic.messages.create({
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }],
      model: 'claude-3-opus-20240229',
    });

    const messageContent = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : 'No response generated';

    return NextResponse.json({
      response: messageContent,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}