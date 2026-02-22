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

    return transaction;
  }

  async getAllTransactions() {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    return result.rows;
  }
}