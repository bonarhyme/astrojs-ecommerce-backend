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
exports.reduceCountInStock = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_model_1 = require("../models/product.model");
/** Use this to reduce the count in stock of a product */
exports.reduceCountInStock = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItems } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    }
    else {
        orderItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.Product.findById(item.product);
            if (product) {
                product.countInStock = product.countInStock - item.qty;
                yield product.save();
            }
            return item;
        }));
        next();
    }
}));
