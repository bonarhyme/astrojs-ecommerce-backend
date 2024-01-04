"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
/** Method used to check if password is valid */
schema.method('matchPassword', function matchPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
});
// This will be run when an update operation is being run
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if password has not been changed and skip process
        if (!this.isModified('password')) {
            next();
        }
        // We now know that password has been modified.
        // Generate salt for password
        const salt = yield bcryptjs_1.default.genSalt(10);
        // Hash the modified password and update the password field
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
/** User Model. Use it to run CRUD on any user */
exports.User = mongoose_1.default.model('User', schema);
