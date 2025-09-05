"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const database_1 = require("../config/database");
class TransactionModel {
    static async create(transactionData) {
        const { user_id, category_id, amount, description, date } = transactionData;
        const [result] = await database_1.pool.execute('INSERT INTO transactions (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)', [user_id, category_id, amount, description, date || new Date()]);
        const insertResult = result;
        return this.findById(insertResult.insertId);
    }
    static async findById(id) {
        const [rows] = await database_1.pool.execute('SELECT * FROM transactions WHERE id = ?', [id]);
        const transactions = rows;
        return transactions[0];
    }
    static async findByUserId(userId) {
        const [rows] = await database_1.pool.execute(`
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.date DESC
    `, [userId]);
        return rows;
    }
    static async update(id, userId, updateData) {
        const fields = [];
        const values = [];
        if (updateData.category_id !== undefined) {
            fields.push('category_id = ?');
            values.push(updateData.category_id);
        }
        if (updateData.amount !== undefined) {
            fields.push('amount = ?');
            values.push(updateData.amount);
        }
        if (updateData.description !== undefined) {
            fields.push('description = ?');
            values.push(updateData.description);
        }
        if (updateData.date !== undefined) {
            fields.push('date = ?');
            values.push(updateData.date);
        }
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        values.push(id, userId);
        await database_1.pool.execute(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
        return this.findById(id);
    }
    static async delete(id, userId) {
        await database_1.pool.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    }
    static async getSummary(userId) {
        const [rows] = await database_1.pool.execute(`
      SELECT 
        COALESCE(SUM(CASE WHEN c.type = 'EARNING' THEN t.amount ELSE 0 END), 0) as totalEarnings,
        COALESCE(SUM(CASE WHEN c.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) as totalExpenses
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `, [userId]);
        const result = rows;
        const summary = result[0];
        return {
            totalEarnings: parseFloat(summary.totalEarnings) || 0,
            totalExpenses: parseFloat(summary.totalExpenses) || 0,
            balance: (parseFloat(summary.totalEarnings) || 0) - (parseFloat(summary.totalExpenses) || 0)
        };
    }
}
exports.TransactionModel = TransactionModel;
//# sourceMappingURL=Transaction.js.map