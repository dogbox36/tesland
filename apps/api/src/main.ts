import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            'http://localhost:4000',
            'http://localhost:4001',
            'http://localhost:3000',
            'http://localhost:3001',
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d{1,5}$/, // Allow local network
        ],
        credentials: true,
    });

    app.use(helmet());

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    await app.listen(process.env.API_PORT || 3002, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
