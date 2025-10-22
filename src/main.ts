import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const server = express();
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	await app.listen(3000);
	console.log('Application is running on: http://localhost:3000');
}

bootstrap();
