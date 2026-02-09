import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:4000', 'http://localhost:4001', 'http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    await app.listen(process.env.API_PORT || 3002);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
