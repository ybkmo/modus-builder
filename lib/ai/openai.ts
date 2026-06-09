import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const SYSTEM_PROMPT = `You are an expert web-design AI assistant for MODUS Builder.
Given a user prompt describing a section or page, return a JSON array of blocks.

Each block must have:
- type: string (e.g. "hero", "features", "testimonials", "contact", "text", "image", "gallery")
- props: object with keys relevant to that block type

Example output:
[
  {
    "type": "hero",
    "props": {
      "title": "Welcome",
      "subtitle": "...",
      "ctaText": "Learn More",
      "ctaLink": "#about"
    }
  }
]

Respond ONLY with valid JSON. Do not wrap in markdown code fences.`;

export async function generateBlocks(prompt: string): Promise<Array<{ type: string; props: Record<string, unknown> }>> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const raw = response.choices[0]?.message?.content?.trim() || '';
    if (!raw) {
      throw new Error('OpenAI returned empty content.');
    }

    // Strip markdown fences if present
    const json = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const blocks = JSON.parse(json);

    if (!Array.isArray(blocks)) {
      throw new Error('Expected a JSON array of blocks from OpenAI.');
    }

    return blocks;
  } catch (error: any) {
    console.error('[OpenAI] generateBlocks error:', error?.message || error);
    throw error;
  }
}
