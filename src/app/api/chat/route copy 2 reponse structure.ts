import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface FormatConfig {
  format: 'markdown' | 'plain';
  depth: 'detailed' | 'concise';
  tone: 'formal' | 'informal';
}

// Premier appel : Formatage
async function getFormatInstructions(message: string, config: FormatConfig) {
  const formatPrompt = `Analysez la question suivante et fournissez une structure de réponse appropriée:
  "${message}"
  
  Retournez uniquement la structure, sans contenu.
  Incluez les sections pertinentes et leur hiérarchie.`;

  const formatCompletion = await anthropic.messages.create({
    max_tokens: 500,
    messages: [{ role: 'user', content: formatPrompt }],
    model: 'claude-3-opus-20240229',
    temperature: 0.3
  });

  return formatCompletion.content[0].type === 'text' 
    ? formatCompletion.content[0].text 
    : '';
}

// Deuxième appel : Contenu
async function getFormattedResponse(message: string, formatInstructions: string) {
  const contentPrompt = `Utilisez la structure suivante pour répondre à la question:
  
  Structure à suivre:
  ${formatInstructions}
  
  Question: "${message}"
  
  Fournissez une réponse complète en suivant exactement cette structure.`;

  const responseCompletion = await anthropic.messages.create({
    max_tokens: 1000,
    messages: [{ role: 'user', content: contentPrompt }],
    model: 'claude-3-opus-20240229',
    temperature: 0.7
  });

  return responseCompletion.content[0].type === 'text' 
    ? responseCompletion.content[0].text 
    : 'No response generated';
}

// Route principale
export async function POST(req: Request) {
  try {
    const { message, config } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Configuration par défaut
    const defaultConfig: FormatConfig = {
      format: 'markdown',
      depth: 'detailed',
      tone: 'formal'
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Premier appel pour obtenir le format
    const formatInstructions = await getFormatInstructions(message, finalConfig);

    // Deuxième appel pour obtenir la réponse formatée
    const formattedResponse = await getFormattedResponse(message, formatInstructions);

    return NextResponse.json({
      response: formattedResponse,
      format: formatInstructions // Optionnel : retourner aussi le format utilisé
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Request processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}