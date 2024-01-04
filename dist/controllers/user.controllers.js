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
exports.updateUser = exports.getUserById = exports.deleteUser = exports.getUsers = exports.updateUserProfile = exports.getUserProfile = exports.login = exports.register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jwt_token_1 = require("../helpers/jwt-token");
const user_model_1 = require("../models/user.model");
/**
 * @public
 * POST request
 * @route /api/users/register
 * Controller to register a new user
 */
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        //This helps to complete the password match
        const userExists = yield user_model_1.User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const user = yield user_model_1.User.create({
            name,
            email,
            password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: (0, jwt_token_1.generateToken)(user._id),
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @public
 * Post request
 * @route  /api/users/login
 * Controller to generate a new token for user
 */
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //This helps to complete the password match
        const user = yield user_model_1.User.findOne({ email });
        if (user && (yield user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: (0, jwt_token_1.generateToken)(user._id),
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @protected
 * Get request
 * @route /api/users/profile
 * Controller to fetch user profile
 */
exports.getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @protected
 * PUT request
 * @route /api/users/profile
 * Controller to update a user profile
 */
exports.updateUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = yield user_model_1.User.findById((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = yield user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: (0, jwt_token_1.generateToken)(updatedUser._id),
        });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins alone
 * Get request
 * @route /api/users
 * Controller to get all the users
 * TODO: Add pagination
 */
exports.getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find({});
        if (!users.length) {
            res.status(404);
            throw new Error('Users not found');
        }
        res.json(users);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins
 * Delete request
 * @route /api/users/:id
 * Controller to remove a user from the system
 * TODO: Do not remove users entirely. Instead deactivate users
 */
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        yield user.deleteOne();
        res.json({ message: 'User [ ' + user.name + ' ] has been removed Successfully' });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins
 * Get request
 * @route /api/users/:id
 * Controller to get a user by their Id.
 */
exports.getUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.json(user);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins
 * PUT request
 * @route  /api/users/:id
 * Controller to update a user by an admin
 */
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        const updatedUser = yield user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
