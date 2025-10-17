import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new TransformInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Medical-Clinic API')
    .setDescription('A comprehensive API for Clinic management')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('patients', 'Patient management endpoints')
    .addTag('patient-images', 'Patient images management endpoints')
    .addTag('staff', 'Staff management endpoints')
    .addTag('doctors', 'Doctor management endpoints')
    .addTag('appointments', 'Appointment management endpoints')
    .addTag('medical-records', 'Medical records management endpoints')
    .addTag('treatment-plans', 'Treatment plans management endpoints')
    .addTag('procedures', 'Procedures management endpoints')
    .addTag('clinical-documents', 'Clinical documents management endpoints')
    .addTag('expenses', 'Expenses management endpoints')
    .addTag('other-incomes', 'Other incomes management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 API running on http://localhost:${process.env.PORT ?? 3000}/api/v1`,
  );
  console.log(
    `🚀 Swagger docs running on http://localhost:${process.env.PORT ?? 3000}/api/v1/docs`,
  );
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
