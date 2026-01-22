import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Groq from 'groq-sdk';
import { MoodResponse } from './interface/mood-response-interface';

@Injectable()
export class MoodService {
  private readonly groq: Groq;

  private static readonly MODEL = 'llama-3.3-70b-versatile';

  private static readonly SYSTEM_PROMPT = `
      You are a mood-to-visual translator.
      Return ONLY valid JSON in this exact format:
      {"color":"#hex","vibe":"string","icon":"PascalCaseLucideIcon"}

      Rules:
      - color must be a valid hex color
      - icon must be a valid Lucide React icon name (PascalCase)
      Examples: CloudRain, Sun, Zap, Flame, Skull, Coffee, Ghost
      `.trim();

  constructor() {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is missing');

    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async getVibe(text: string): Promise<MoodResponse> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: MoodService.MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: MoodService.SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      });

      const content = completion.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty AI response');
      }

      return this.safeParse(content);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate mood visualization',
        error,
      );
    }
  }

  private safeParse(content: string): MoodResponse {
    try {
      return JSON.parse(content) as MoodResponse;
    } catch {
      throw new Error(`Invalid JSON from AI: ${content}`);
    }
  }
}
