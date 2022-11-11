import { NestFactory } from '@nestjs/core';
import {
    BadRequestException,
    ValidationPipe,
    ValidationError,
} from '@nestjs/common';
import { AppModule } from 'app/.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Use body, query and parameter validator
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            exceptionFactory: (errors: ValidationError[]): any => {
                return new BadRequestException(errors.join('; ').replace(/\n/g, ''));
            },
        }),
    );
    await app.listen(3000);
}
bootstrap();
