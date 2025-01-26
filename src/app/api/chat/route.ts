import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';



const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
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

    // Check if there's content and it's of type text
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
