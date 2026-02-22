import Fastify from 'fastify';
import transactionRoutes from './routes/transactions';

const app = Fastify({
    logger: true
});

// Routes
app.register(transactionRoutes, { prefix: '/transactions' });

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log('Server running on http://localhost:3000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();