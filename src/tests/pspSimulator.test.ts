import { PspService, PspRequest } from '../services/psp.service';

jest.mock('uuid', () => ({
    v4: () => 'mocked-uuid-1234'
}));

global.fetch = jest.fn() as jest.Mock;

describe('PSP simulator behavior (success / failure / 3DS)', () => {
    let pspService: PspService;

    const basePayload: PspRequest = {
        amount: 1000,
        currency: 'EUR',
        cardNumber: '',
        cardExpiry: '12/25',
        cvv: '123',
        orderId: 'order_123',
        callbackUrl: 'http://localhost:3000/webhooks/psp',
        failureUrl: 'http://localhost:3000/failure/psp'
    };

    beforeEach(() => {
        pspService = new PspService();
        jest.clearAllMocks();
    });

    test('should return PENDING_3DS for card start with 4111', async () => {
        const result = await pspService.createTransaction({
            ...basePayload,
            cardNumber: '4111111111111111'
        });

        expect(result.status).toBe('PENDING_3DS');
        expect(result['3dsRedirectUrl']).toBeDefined();
    });

    test('should return FAILED for 4000', async () => {
        const result = await pspService.createTransaction({
            ...basePayload,
            cardNumber: '4000000000000000'
        });

        expect(result.status).toBe('FAILED');
        expect(result['3dsRedirectUrl']).toBeUndefined();
    });

    test('should return SUCCESS for 5555', async () => {
        const result = await pspService.createTransaction({
            ...basePayload,
            cardNumber: '5555555555555555'
        });

        expect(result.status).toBe('SUCCESS');
        expect(result['3dsRedirectUrl']).toBeUndefined();
    });
});