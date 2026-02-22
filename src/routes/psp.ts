import { FastifyInstance } from 'fastify';
import { PspRequest, PspService } from '../services/psp.service';

const pspService = new PspService();

export default async function pspRoutes(fastify: FastifyInstance) {
  fastify.post('/transactions', {
    schema: {
      body: {
        type: 'object',
        required: ['amount', 'currency', 'cardNumber', 'cardExpiry', 'cvv', 'orderId', 'callbackUrl', 'failureUrl'],
        properties: {
          amount: { type: 'number' },
          currency: { type: 'string' },
          cardNumber: { type: 'string' },
          cardExpiry: { type: 'string' },
          cvv: { type: 'string' },
          orderId: { type: 'string' },
          callbackUrl: { type: 'string' },
          failureUrl: { type: 'string' }
        },
        examples: [{
          amount: 1000,
          currency: "EUR",
          cardNumber: "4111111111111111",
          cardExpiry: "12/25",
          cvv: "123",
          orderId: "order_123",
          callbackUrl: "http://localhost:3000/webhooks/psp",
          failureUrl: "http://localhost:3000/failure/psp"
        }]
      },
      response: {
        201: {
          type: 'object',
          properties: {
            pspTransactionId: { type: 'string', format: 'uuid' },
            status: { type: 'string' }
          },
          examples: [{
            pspTransactionId: "a9799275-d4ed-40c4-bc6b-218b41ab0a1a",
            status: "SUCCESS"
          }]
        },
        400: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const payload = request.body as PspRequest;

    try {
      const result = await pspService.createTransaction(payload);
      return reply.code(201).send(result);
    } catch (err: any) {
      return reply.code(400).send({ message: err.message });
    }
  });
}