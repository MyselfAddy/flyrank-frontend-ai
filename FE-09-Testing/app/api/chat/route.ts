import { streamText, createDataStreamResponse, formatDataStreamPart } from 'ai';
import { getGeminiModel, SYSTEM_PROMPT } from '@/lib/ai';
import { analyzeWebsite } from '@/lib/tools/analyzeWebsite';

export const runtime = 'nodejs';

/**
 * Helper to identify if an error is a Google Gemini / AI Provider rate limit.
 */
function isRateLimitError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const status = (error as { status?: number })?.status;
  return (
    status === 429 ||
    msg.includes('429') ||
    msg.toLowerCase().includes('rate limit') ||
    msg.toLowerCase().includes('quota') ||
    msg.includes('RESOURCE_EXHAUSTED')
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, devSimulateError } = body;
    const devSimulateHeader = req.headers.get('x-dev-simulate-error');
    const simulation = devSimulateError || devSimulateHeader;

    // --- DEVELOPMENT ONLY TEST SIMULATION HOOKS ---
    if (process.env.NODE_ENV !== 'production' && simulation) {
      if (simulation === 'generic') {
        return new Response(
          JSON.stringify({
            error: 'Simulated 500 Server Error: Internal processing failure.',
            code: 'SIMULATED_GENERIC_ERROR',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (simulation === 'rate_limit') {
        return new Response(
          JSON.stringify({
            error: 'Simulated 429: Gemini API rate limit reached. The service is temporarily busy.',
            code: 'RATE_LIMIT',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (simulation === 'mid_stream') {
        return createDataStreamResponse({
          execute: async (dataStream) => {
            dataStream.write(
              formatDataStreamPart(
                'text',
                'Here is the initial portion of the simulated response before an unexpected network drop... '
              )
            );
            // Simulate brief stream duration
            await new Promise((resolve) => setTimeout(resolve, 300));
            throw new Error('Simulated mid-stream connection loss.');
          },
          onError: (err) =>
            err instanceof Error
              ? err.message
              : 'Stream interrupted unexpectedly.',
        });
      }
    }
    // --- END DEV HOOKS ---

    // Validate payload
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request: "messages" array is required and cannot be empty.',
          code: 'BAD_REQUEST',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check Gemini API key existence
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[API Route] GEMINI_API_KEY environment variable is not defined.');
      return new Response(
        JSON.stringify({
          error: 'Server configuration error: Gemini API key is missing.',
          code: 'MISSING_API_KEY',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = getGeminiModel();

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      tools: {
        analyzeWebsite,
      },
      maxSteps: 3,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err: unknown) => {
        if (isRateLimitError(err)) {
          return 'Rate limit reached: Gemini API is temporarily busy. Please wait a moment.';
        }
        return err instanceof Error ? err.message : 'Streaming error occurred.';
      },
      headers: {
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: unknown) {
    console.error('Error in /api/chat handler:', error);

    if (isRateLimitError(error)) {
      return new Response(
        JSON.stringify({
          error: 'The AI service is temporarily busy (Rate limit exceeded). Please try again shortly.',
          code: 'RATE_LIMIT',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to generate AI response.';

    return new Response(
      JSON.stringify({
        error: errorMessage,
        code: 'SERVER_ERROR',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

