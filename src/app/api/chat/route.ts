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
      const errorLog = {
        timestamp: new Date().toISOString(),
        status: 'error',
        errorType: 'ValidationError',
        message: 'Message is required',
        requestData: { message }
      };
      console.error(JSON.stringify(errorLog));

      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const requestLog = {
      timestamp: new Date().toISOString(),
      status: 'request',
      requestData: {
        message,
        model: 'claude-3-opus-20240229',
        max_tokens: 1000
      }
    };
    console.log(JSON.stringify(requestLog));

    const completion = await anthropic.messages.create({
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }],
      model: 'claude-3-opus-20240229',
    });

    const messageContent = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : 'No response generated';

    const endTime = Date.now();
    
    const successLog = {
      timestamp: new Date().toISOString(),
      status: 'success',
      requestData: {
        message,
        model: completion.model
      },
      responseData: {
        content: messageContent.slice(0, 200), // Truncate long responses
        usage: completion.usage,
        latency: endTime - startTime,
        id: completion.id,
        role: completion.role,
        model: completion.model
      }
    };
    console.log(JSON.stringify(successLog));

    return NextResponse.json({
      response: messageContent,
    });

  } catch (error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      status: 'error',
      errorType: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      stack: error instanceof Error ? error.stack : null,
      requestData: { message: req.body ? await req.json().message : 'N/A' }
    };
    console.error(JSON.stringify(errorLog));

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
