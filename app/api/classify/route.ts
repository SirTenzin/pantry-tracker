import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth';

async function query(data: ArrayBuffer) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/nateraw/food",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_SECRET}`,
        "Content-Type": "application/octet-stream",
      },
      method: "POST",
      body: data,
    }
  );
  const result = await response.json();
  return result;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const buffer = await image.arrayBuffer();
  const result = await query(buffer);

  return NextResponse.json(result);
}