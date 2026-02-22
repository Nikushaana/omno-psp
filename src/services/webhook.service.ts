import { pool } from '../config/db';
import { validTransitions } from '../domain/transaction.state';

export interface WebhookPayload {
  transactionId: string;
  final_amount?: number;
  status: 'SUCCESS' | 'FAILED' | '3DS_REQUIRED';
}

export class WebhookService {
  async handlePspWebhook(payload: WebhookPayload) {
    // find transaction by psp id
    const transactionRes = await pool.query('SELECT * FROM transactions WHERE psp_id = $1', [
      payload.transactionId,
    ]);
    const transaction = transactionRes.rows[0];
    if (!transaction) throw new Error('Transaction not found');

    // check if status is already same, to not make same update
    if (transaction.status === payload.status) return { message: 'Already processed' };

    // validate state transition
    if (!validTransitions[transaction.status].includes(payload.status)) {
      throw new Error(`Invalid status transition: ${transaction.status} -> ${payload.status}`);
    }

    // update transaction final
    await pool.query(
      `
      UPDATE transactions
      SET status = $2,
          amount = COALESCE($3, amount)
      WHERE id = $1
      `,
      [transaction.id, payload.status, payload.final_amount]
    );

    return { message: 'Transaction updated successfully' };
  }
}