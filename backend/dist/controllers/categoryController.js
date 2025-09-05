"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const Category_mongo_1 = require("../models/Category-mongo");
const getCategories = async (req, res) => {
    try {
        const categories = await Category_mongo_1.CategoryModel.findAll();
        // Transform MongoDB _id to id for frontend compatibility
        const transformedCategories = categories.map(category => ({
            id: category._id.toString(),
            name: category.name,
            type: category.type,
            created_at: category.created_at
        }));
        res.json(transformedCategories);
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=categoryController.js.map