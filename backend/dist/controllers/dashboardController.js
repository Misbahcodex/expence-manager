"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = void 0;
const Transaction_mongo_1 = require("../models/Transaction-mongo");
const getSummary = async (req, res) => {
    try {
        const summary = await Transaction_mongo_1.TransactionModel.getSummary(req.user.id.toString());
        res.json(summary);
    }
    catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getSummary = getSummary;
//# sourceMappingURL=dashboardController.js.map