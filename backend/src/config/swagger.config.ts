import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('CTF Platform API')
    .setDescription(
      'APIs for CTF (Capture The Flag) competition management platform. ' +
      'Handles authentication, competitions, challenges, submissions, and real-time leaderboards.'
    )
    .setVersion('1.1.0') // Updated version
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'User management')
    .addTag('competitions', 'Competition management')
    .addTag('challenges', 'Challenge management')
    .addTag('submissions', 'Flag submissions')
    .addTag('leaderboard', 'Leaderboard and scoring')
    .addTag('teams', 'Team management')
    .addTag('files', 'File uploads and downloads')
    .addTag('admin', 'Admin operations (CTF organizers)')
    .addTag('superadmin', 'SuperAdmin operations (platform owners)')
    .addTag('monitoring', 'Health checks and monitoring')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token from Clerk',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI
  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'CTF Platform API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  // Add /swagger-json endpoint for raw JSON spec
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });

  // Optional: expose JSON under API prefix
  // app.getHttpAdapter().get('/api/v1/swagger-json', (req, res) => res.json(document));
}
