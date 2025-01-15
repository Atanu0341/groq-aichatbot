import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is not set');
        }

        const result = streamText({
            model: groq('mixtral-8x7b-32768'),
            messages,
            system: 'You are a helpful AI assistant. You provide clear, concise, and accurate responses.',
        })

        return result.toDataStreamResponse();
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            error: 'An error occurred while processing your request',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}