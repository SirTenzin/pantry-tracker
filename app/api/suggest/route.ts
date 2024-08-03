import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { items } = await request.json();

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const itemNames = items.join(', ');
    const stream = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that suggests recipes based on available ingredients. You will always format your answer in markdown."
        },
        {
          role: "user",
          content: `I have these ingredients: ${itemNames}. Suggest a recipe I can make.`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      stream: true,
      stop: null
    });

    const encoder = new TextEncoder();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(text)}\n\n`));
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  } catch (error) {
    console.error('Error generating recipe suggestion:', error);
    return NextResponse.json({ error: 'Failed to generate recipe suggestion' }, { status: 500 });
  }
}