"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const database_1 = require("../config/database");
class CategoryModel {
    static async findAll() {
        const [rows] = await database_1.pool.execute('SELECT * FROM categories ORDER BY type, name');
        return rows;
    }
    static async findById(id) {
        const [rows] = await database_1.pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
        const categories = rows;
        return categories[0] || null;
    }
    static async findByType(type) {
        const [rows] = await database_1.pool.execute('SELECT * FROM categories WHERE type = ? ORDER BY name', [type]);
        return rows;
    }
}
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=Category.js.map