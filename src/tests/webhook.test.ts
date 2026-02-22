import { WebhookService, WebhookPayload } from '../services/webhook.service';
import { pool } from '../config/db';

jest.mock('../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Webhook idempotency (same webhook sent twice)', () => {
    let webhookService: WebhookService;

    const mockPayload: WebhookPayload = {
        transactionId: 'psp_123',
        status: 'SUCCESS',
        final_amount: 1000
    };

    beforeEach(() => {
        webhookService = new WebhookService();
        jest.clearAllMocks();
    });

    test('should process the first webhook and ignore second identical one', async () => {
        // first call
        // simulate finding a PENDING transaction in DB
        (pool.query as jest.Mock)
            .mockResolvedValueOnce({
                rows: [{ id: 1, psp_id: 'psp_123', status: 'CREATED', amount: 1000 }]
            })
            .mockResolvedValueOnce({ rowCount: 1 });

        const firstResult = await webhookService.handlePspWebhook(mockPayload);

        // second call
        // simulate finding the transaction ALREADY UPDATED to SUCCESS
        (pool.query as jest.Mock).mockResolvedValueOnce({
            rows: [{ id: 1, psp_id: 'psp_123', status: 'SUCCESS', amount: 1000 }]
        });

        const secondResult = await webhookService.handlePspWebhook(mockPayload);

        // first one should success
        expect(firstResult.message).toBe('Transaction updated successfully');

        // second one should throw error
        expect(secondResult.message).toBe('Already processed');
    });
});