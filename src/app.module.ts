import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoodController } from './mood/mood.controller';
import { MoodService } from './mood/mood.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [MoodController],
  providers: [MoodService],
})
export class AppModule {}
