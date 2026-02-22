import Fastify from 'fastify';

const server = Fastify({
  logger: true
});

server.get('/', async (request, reply) => {
  return { hello: 'world', status: 'working' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();