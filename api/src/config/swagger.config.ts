import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import projectConfig from '../../package.json';

interface ProjectConfig {
  name: string;
  version: string;
}

export function setupSwagger(app: INestApplication) {
  const { name, version } = projectConfig as ProjectConfig;
  const apiName = name;

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(`${apiName} API`)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app as any, config);

  // This applies the security scheme globally to all endpoints
  document.components = {
    ...document.components,
    securitySchemes: {
      'access-token': {
        type: 'http',
        scheme: 'bearer',
      },
    },
  };

  document.security = [{ 'access-token': [] }];

  SwaggerModule.setup('api', app as any, document);
}
