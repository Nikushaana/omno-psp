import { v4 as uuidv4 } from 'uuid';

export type PspRequest = {
    amount: number;
    currency: string;
    cardNumber: string;
    cardExpiry: string;
    cvv: string;
    orderId: string;
    callbackUrl: string;
    failureUrl: string;
};

export class PspService {
    async createTransaction(payload: PspRequest) {
        const pspTransactionId = uuidv4();
        let status: 'PENDING_3DS' | 'SUCCESS' | 'FAILED' = 'SUCCESS';
        let redirectUrl: string | undefined;

        // return status as cardNumber starts
        // 4111 PENDING_3DS
        // 4000 Success
        // 5555 PENDING_3DS
        if (payload.cardNumber.startsWith('4111')) {
            status = 'PENDING_3DS';
            redirectUrl = `http://psp.local/3ds/${pspTransactionId}`;

            // after transaction creation in 5 sec will call webhook api to update final status
            setTimeout(async () => {
                await fetch(payload.callbackUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        transactionId: pspTransactionId,
                        final_amount: payload.amount,
                        status: 'SUCCESS', // or FAILED
                    }),
                });
            }, 5000);
        } else if (payload.cardNumber.startsWith('5555')) {
            status = 'SUCCESS';
        } else if (payload.cardNumber.startsWith('4000')) {
            status = 'FAILED';
        }

        return {
            pspTransactionId,
            status,
            ...(redirectUrl ? { '3dsRedirectUrl': redirectUrl } : {})
        };
    }
}


