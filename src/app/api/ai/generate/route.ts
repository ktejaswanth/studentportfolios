import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';



export async function POST(req: Request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY',
  });
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let systemPrompt = "You are a professional resume and portfolio copywriter. Keep your response concise, professional, and directly usable without pleasantries or markdown blocks.";
    
    if (type === 'summary') {
      systemPrompt += " Write a compelling 2-3 sentence professional summary for a student/developer based on the following input. Make it sound confident and highlight their core focus.";
    } else if (type === 'project') {
      systemPrompt += " Write a strong 2 sentence project description highlighting the problem solved and technologies used based on the following input.";
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 150,
    });

    const generatedText = chatCompletion.choices[0]?.message?.content || '';

    return NextResponse.json({ text: generatedText.trim() });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate text' }, { status: 500 });
  }
}
