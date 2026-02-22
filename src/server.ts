import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import transactionRoutes from './routes/transactions';
import pspRoutes from './routes/psp';
import webhookRoutes from './routes/webhooks';

const app = Fastify({
  logger: true
});

const start = async () => {
  try {
    // register Swagger
    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Payment Gateway API',
          description: 'API for processing transactions and handling PSP webhooks',
          version: '1.0.0'
        },
        components: {
          securitySchemes: {
            apiKey: {
              type: 'apiKey',
              name: 'apiKey',
              in: 'header'
            }
          }
        }
      }
    });

    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      },
      staticCSP: true,
      transformStaticCSP: (header) => header
    });

    // Routes
    app.register(transactionRoutes, { prefix: '/transactions' });
    app.register(pspRoutes, { prefix: '/psp' });
    app.register(webhookRoutes, { prefix: '/webhooks' });

    await app.listen({ port: 3000 });

    console.log('Server running on http://localhost:3000');
    console.log('Documentation available at http://localhost:3000/docs');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();