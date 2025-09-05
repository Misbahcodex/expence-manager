"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
class UserModel {
    static async create(userData) {
        const { name, email, password } = userData;
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const verificationToken = (0, uuid_1.v4)();
        const [result] = await database_1.pool.execute('INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, verificationToken]);
        const insertResult = result;
        return this.findById(insertResult.insertId);
    }
    static async findById(id) {
        const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        const users = rows;
        return users[0];
    }
    static async findByEmail(email) {
        const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const users = rows;
        return users[0] || null;
    }
    static async findByVerificationToken(token) {
        const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE verification_token = ?', [token]);
        const users = rows;
        return users[0] || null;
    }
    static async findByResetToken(token) {
        const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()', [token]);
        const users = rows;
        return users[0] || null;
    }
    static async verifyEmail(id) {
        await database_1.pool.execute('UPDATE users SET is_verified = true, verification_token = NULL WHERE id = ?', [id]);
    }
    static async setResetToken(email, token, expiry) {
        await database_1.pool.execute('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', [token, expiry, email]);
    }
    static async resetPassword(token, newPassword) {
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await database_1.pool.execute('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?', [hashedPassword, token]);
    }
    static async validatePassword(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map