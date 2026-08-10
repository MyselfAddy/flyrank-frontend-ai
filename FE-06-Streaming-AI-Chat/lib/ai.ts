import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Centralized AI Configuration Module for FE-06 Streaming AI Chat.
 * 
 * Why configuration lives here:
 * 1. Single source of truth for AI provider instance, model selection, and prompt engineering.
 * 2. Prevents scattering system prompts across API routes and components.
 * 3. Guarantees that the GEMINI_API_KEY is read strictly on the server side via process.env.GEMINI_API_KEY.
 * 4. Ensures consistent model selection and parameters across streaming sessions.
 */

/**
 * Verified real Google Gemini model identifier supported in this environment.
 * Using gemini-3.6-flash for fast, responsive streaming chat interactions.
 */
export const MODEL_NAME = 'gemini-3.6-flash';

/**
 * Centralized System Prompt defining the AI assistant persona and response guidelines.
 */
export const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and polite AI assistant.
Your goal is to provide accurate, concise, and structured answers to user inquiries.
When explaining technical or multi-step topics, organize your response with clear formatting.`;

/**
 * Server-side Gemini model instance using @ai-sdk/google.
 * Explicitly passes process.env.GEMINI_API_KEY on the server.
 */
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey && typeof window === 'undefined') {
    console.warn('[AI Config] Warning: GEMINI_API_KEY environment variable is not defined.');
  }

  const google = createGoogleGenerativeAI({
    apiKey: apiKey || '',
  });

  return google(MODEL_NAME);
}

