import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import {ValidationPipe } from '@nestjs/common' ;
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	// app.useStaticAssets(join(__dirname, '..', 'front'));
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({transform: true}));
	await app.listen(3000);
}
bootstrap();
