import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(app: INestApplication, url: string): void {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Barberize API')
    .setDescription('API documentation.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(url, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
