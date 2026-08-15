import { streamText } from 'ai';
import { getGeminiModel, SYSTEM_PROMPT } from '@/lib/ai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: "messages" must be an array.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = getGeminiModel();

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toDataStreamResponse({
      headers: {
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: unknown) {
    console.error('Error handling /api/chat streaming request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
