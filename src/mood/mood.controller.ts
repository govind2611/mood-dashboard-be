import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MoodService } from './mood.service';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateMood(@Body('prompt') prompt: string) {
    return await this.moodService.getVibe(prompt);
  }
}
