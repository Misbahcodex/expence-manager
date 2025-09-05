"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verification_token: {
        type: String,
        default: () => (0, uuid_1.v4)()
    },
    reset_token: String,
    reset_token_expiry: Date,
    created_at: {
        type: Date,
        default: Date.now
    }
});
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.User = mongoose_1.default.model('User', UserSchema);
class UserModel {
    static async create(userData) {
        const user = new exports.User(userData);
        return await user.save();
    }
    static async findById(id) {
        return await exports.User.findById(id);
    }
    static async findByEmail(email) {
        return await exports.User.findOne({ email });
    }
    static async findByVerificationToken(token) {
        return await exports.User.findOne({ verification_token: token });
    }
    static async findByResetToken(token) {
        return await exports.User.findOne({
            reset_token: token,
            reset_token_expiry: { $gt: new Date() }
        });
    }
    static async verifyEmail(id) {
        await exports.User.findByIdAndUpdate(id, {
            is_verified: true,
            verification_token: undefined
        });
    }
    static async setResetToken(email, token, expiry) {
        await exports.User.findOneAndUpdate({ email }, { reset_token: token, reset_token_expiry: expiry });
    }
    static async resetPassword(token, newPassword) {
        const user = await exports.User.findOne({ reset_token: token });
        if (user) {
            user.password = newPassword;
            user.reset_token = undefined;
            user.reset_token_expiry = undefined;
            await user.save();
        }
    }
    static async validatePassword(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User-mongo.js.map