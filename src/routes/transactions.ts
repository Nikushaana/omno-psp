import { FastifyInstance } from 'fastify';
import { TransactionPayload, TransactionService } from '../services/transaction.service';

const transactionService = new TransactionService();

export default async function transactionRoutes(fastify: FastifyInstance) {
    fastify.post('/',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['amount', 'currency', 'cardNumber', 'cardExpiry', 'cvv', 'orderId'],
                    properties: {
                        amount: { type: 'number' },
                        currency: { type: 'string' },
                        cardNumber: { type: 'string' },
                        cardExpiry: { type: 'string' },
                        cvv: { type: 'string' },
                        orderId: { type: 'string' }
                    },
                    examples: [
                        {
                            amount: 1000,
                            currency: "EUR",
                            cardNumber: "4111111111111111",
                            cardExpiry: "12/25",
                            cvv: "123",
                            orderId: "order_123",
                            callbackUrl: "http://localhost:3000/webhooks/psp",
                            failureUrl: "http://localhost:3000/failure/psp"
                        }
                    ]
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            transactionId: { type: 'string' },
                            status: { type: 'string' },
                        },
                        example: {
                            transactionId: "a9799275-d4ed-40c4-bc6b-218b41ab0a1a",
                            status: "PENDING",
                        }
                    },
                    400: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        },
                        example: {
                            message: "PSP simulator call failed"
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const payload = request.body as TransactionPayload;
                const result = await transactionService.createTransactionWithPsp(payload);
                return reply.code(201).send(result);
            } catch (err: any) {
                return reply.code(400).send({ message: err.message });
            }
        }
    );

    fastify.get('/', async (request, reply) => {
        try {
            const transactions = await transactionService.getAllTransactions();
            return reply.code(200).send(transactions);
        } catch (err: any) {
            return reply.code(500).send({ message: err.message });
        }
    });
}