import { FastifyInstance } from 'fastify';
import { WebhookPayload, WebhookService } from '../services/webhook.service';

const webhookService = new WebhookService();

export default async function webhookRoutes(fastify: FastifyInstance) {
    fastify.post('/psp', {
        schema: {
            body: {
                type: 'object',
                required: ['transactionId', 'status', 'final_amount'],
                properties: {
                    transactionId: { type: 'string' },
                    status: { type: 'string' },
                    final_amount: { type: 'number' }
                },
                examples: [{
                    transactionId: "a9799275-d4ed-40c4-bc6b-218b41ab0a1a",
                    status: "SUCCESS",
                    final_amount: 1000
                }]
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    examples: [{ message: 'Transaction updated successfully' }]
                },
                400: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    examples: [{ message: 'Already processed' }]
                },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    examples: [{ message: 'Transaction not found' }]
                }
            }
        }
    }, async (request, reply) => {
        const payload = request.body as WebhookPayload;

        try {
            const result = await webhookService.handlePspWebhook(payload);
            return reply.code(200).send(result);
        } catch (err: any) {
            return reply.code(400).send({ message: err.message });
        }
    });
}