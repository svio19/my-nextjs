import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Définition des types pour le système de prompts
interface PromptConfig {
  format: 'markdown' | 'plain';
  sections: string[];
  style: 'detailed' | 'concise';
  tone: 'formal' | 'informal';
}

// Système de prompts réutilisable
const baseSystemPrompt = {
  format: "markdown",
  rules: [
    "Direct tone",
    "Actionable suggestions",
    "Concrete examples",
    "Emoji usage"
  ]
};

// Configuration des fonction calls
const functionCalls = {
  formatResponse: (config: PromptConfig) => ({
    structure: config.format,
    sections: config.sections,
    style: config.style
  }),
  generateAnalysis: (depth: string) => ({
    analysisDepth: depth,
    includeExamples: true
  }),
  createSuggestions: (count: number) => ({
    suggestionCount: count,
    actionable: true
  })
};

export async function POST(req: Request) {
  try {
    const { message, config } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Construction du prompt enrichi
    const enhancedPrompt = buildEnhancedPrompt(message, config);

    // Création du message avec le système de prompts
    const completion = await anthropic.messages.create({
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: JSON.stringify(baseSystemPrompt)
        },
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      model: 'claude-3-opus-20240229',
    });

    // Traitement et validation de la réponse
    const response = processResponse(completion);

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour construire le prompt enrichi
function buildEnhancedPrompt(message: string, config?: Partial<PromptConfig>): string {
  const defaultConfig: PromptConfig = {
    format: 'markdown',
    sections: ['analysis', 'suggestions'],
    style: 'detailed',
    tone: 'informal'
  };

  const finalConfig = { ...defaultConfig, ...config };
  
  const formatCall = functionCalls.formatResponse(finalConfig);
  const analysisCall = functionCalls.generateAnalysis(finalConfig.style);
  const suggestionsCall = functionCalls.createSuggestions(
    finalConfig.style === 'detailed' ? 5 : 3
  );

  return `
    ${JSON.stringify(formatCall)}
    ${JSON.stringify(analysisCall)}
    ${JSON.stringify(suggestionsCall)}
    User Query: ${message}
  `;
}

// Fonction utilitaire pour traiter la réponse
function processResponse(completion: Anthropic.Message) {
  if (!completion.content.length) {
    throw new Error('No content in response');
  }

  const messageContent = completion.content[0].type === 'text'
    ? completion.content[0].text
    : 'No response generated';

  // Validation et nettoyage de la réponse
  return sanitizeResponse(messageContent);
}

// Fonction utilitaire pour nettoyer et valider la réponse
function sanitizeResponse(response: string): string {
  // Ajoutez ici votre logique de nettoyage
  return response.trim();
}

// Types pour la validation des requêtes
interface RequestBody {
  message: string;
  config?: Partial<PromptConfig>;
}
