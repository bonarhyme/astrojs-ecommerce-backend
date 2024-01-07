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
exports.updateOrderToDelivered = exports.getOrders = exports.getMyOrders = exports.updateOrderToPaid = exports.getOrderById = exports.addOrderItems = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const order_model_1 = require("../models/order.model");
/**
 * @protected
 * POST request
 * @route /api/orders
 *
 */
exports.addOrderItems = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
        if (!orderItems.length) {
            res.status(400);
            throw new Error('No order items');
        }
        const createdOrder = yield order_model_1.Order.create({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        if (!createdOrder) {
            res.status(500);
            throw new Error('No order items');
        }
        res.status(201).send(createdOrder);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @protected
 * GET request
 * @route /api/orders/:id
 * Fetch an order with id
 */
exports.getOrderById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            res.status(404);
            throw new Error('Order Not found');
        }
        res.send(order);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @protected
 * Put request'
 * @route /api/orders/:id/pay
 * Use this to make payment
 */
exports.updateOrderToPaid = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            res.status(404);
            throw new Error('Order Not found');
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            message: req.body.messge,
            reference: req.body.reference,
            status: req.body.status,
            transactionId: req.body.trans,
            user: order.user.email,
        };
        const updatedOrder = yield order.save();
        res.send(updatedOrder);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @protected
 * GET request
 * @route /api/orders/myorders
 * Controllers to fetch a current user's orders
 */
exports.getMyOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.Order.find({ user: req.user._id });
        if (!orders) {
            res.status(404);
            throw new Error('Order Not found');
        }
        res.send(orders);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins
 * GET request
 * @route /api/orders
 * Fetch all the orders in the system
 * TODO: Add pagination and search filter
 */
exports.getOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //This gets the orders and also gets the user name and ID associated with it
        const orders = yield order_model_1.Order.find({}).populate('user', 'id name');
        if (!orders.length) {
            res.status(404);
            throw new Error('Orders Not found');
        }
        res.send(orders);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins
 * GET request
 * @route /api/orders/:id/deliver
 * COntrollert to update a proposal to delivered
 */
exports.updateOrderToDelivered = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            res.status(404);
            throw new Error('Order Not found');
        }
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = yield order.save();
        if (!updatedOrder) {
            res.status(500);
            throw new Error('Order could not be updated');
        }
        res.send(updatedOrder);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
