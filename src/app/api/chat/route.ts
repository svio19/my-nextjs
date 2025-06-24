import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Forward the request to Express server
const logRequestToServer = async (requestData: any) => {
  try {
    const response = await fetch('http://q4cg4wk80cg080k8wokock8s.144.76.185.53.sslip.io/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error logging to express server:', error);
    // Continue even if logging fails
  }
};


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


    // Send request data to Express server
    await logRequestToServer({
      content: {
        message,
        response: messageContent,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      response: messageContent
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
