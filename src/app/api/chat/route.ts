import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const { message } = await req.json();

    if (!message) {
      console.log({
        timestamp: new Date().toISOString(),
        status: 'error',
        error: 'Message is required',
        requestData: { message }
      });

      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log({
      timestamp: new Date().toISOString(),
      status: 'request',
      requestData: {
        message,
        model: 'claude-3-opus-20240229',
        max_tokens: 1000
      }
    });

    const completion = await anthropic.messages.create({
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }],
      model: 'claude-3-opus-20240229',
    });

    const messageContent = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : 'No response generated';

    const endTime = Date.now();
    
    console.log({
      timestamp: new Date().toISOString(),
      status: 'success',
      requestData: {
        message,
        model: completion.model
      },
      responseData: {
        content: messageContent,
        usage: completion.usage,
        latency: endTime - startTime,
        id: completion.id,
        role: completion.role,
        model: completion.model
      }
    });

    return NextResponse.json({
      response: messageContent,
    });

  } catch (error) {
    console.log({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      },
      requestData: { message }
    });

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
