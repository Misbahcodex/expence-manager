"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_mongo_1 = require("../models/User-mongo");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        const token = authHeader.substring(7);
        const decoded = (0, jwt_1.verifyToken)(token);
        // Verify user still exists and is verified
        const user = await User_mongo_1.UserModel.findById(decoded.userId.toString());
        if (!user || !user.is_verified) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or unverified user'
            });
        }
        req.user = {
            id: user._id.toString(),
            email: user.email
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map