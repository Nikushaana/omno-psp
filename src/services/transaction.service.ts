import { pool } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export interface TransactionPayload {
  amount: number;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
  cvv: string;
  orderId: string;
}

export class TransactionService {

  async createTransactionWithPsp(payload: TransactionPayload) {
    const id = uuidv4();
    const status = 'CREATED';

    // create transaction
    const result = await pool.query(`
      INSERT INTO transactions (id, amount, currency, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [id, payload.amount, payload.currency, status]);

    const transaction = result.rows[0];

    // call psp
    const pspResponse = await fetch('http://localhost:3000/psp/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: payload.amount,
        currency: payload.currency,
        cardNumber: payload.cardNumber,
        cardExpiry: payload.cardExpiry,
        cvv: payload.cvv,
        orderId: payload.orderId,
        callbackUrl: 'http://localhost:3000/webhooks/psp',
        failureUrl: 'http://localhost:3000/failure/psp'
      })
    });

    if (!pspResponse.ok) throw new Error('PSP simulator call failed');

    const pspData = await pspResponse.json();

    // update stratus from psp response
    await this.updateTransactionStatus(
      transaction.id,
      pspData.status,
      pspData.pspTransactionId
    );

    return {
      transactionId: transaction.id,
      status: pspData.status,
      ...(pspData['3dsRedirectUrl'] ? { '3dsRedirectUrl': pspData['3dsRedirectUrl'] } : {})
    };
  }

  async updateTransactionStatus(id: string, newStatus: string, pspTransactionId: string) {
    const query = `
      UPDATE transactions
      SET status = $2, 
          psp_id = COALESCE($3, psp_id)
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id, newStatus, pspTransactionId]);
    return result.rows[0];
  }

  async getAllTransactions() {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    return result.rows;
  }
}