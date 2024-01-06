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
exports.createProductReview = exports.updateProduct = exports.createProduct = exports.deleteProduct = exports.getProductById = exports.getProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_model_1 = require("../models/product.model");
/**
 * @public
 * Get request
 * @route /api/products
 *  Controller to get all paginated products
 */
exports.getProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};
        const count = yield product_model_1.Product.countDocuments(Object.assign({}, keyword));
        const products = yield product_model_1.Product.find(Object.assign({}, keyword))
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        if (!products.length) {
            res.status(404);
            throw new Error('Products not found');
        }
        res.send({ products, page, pages: Math.ceil(count / pageSize) });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @public
 * GET request
 * @route /api/products/:id
 * Controller to fetch a particular product
 */
exports.getProductById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        res.json(product);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admin
 * DELETE request
 * @route /api/products/:id
 * Controller to delete a product
 * TODO: Add implementation to stop the deleting of a product
 */
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        // Allow only the creator to delete the product they add
        if (req.user._id !== product.user._id) {
            res.status(404);
            throw new Error('Product not found');
        }
        yield product.deleteOne();
        res.send({ message: 'Product removed' });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private
 * POST request
 * @route  /api/products
 * COntroller tp create a new product
 * TODO: Use multer and cloudinary for image upload
 */
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, brand, category, countInStock, description, image } = req.body;
        if (!name || !price || !brand || !category || !countInStock || !description || !image) {
            res.status(404);
            throw new Error('Missing required fields');
        }
        const newProduct = product_model_1.Product.create({
            name,
            price,
            user: req.user._id,
            image,
            brand,
            category,
            countInStock,
            numReviews: 0,
            description,
        });
        if (!newProduct) {
            res.status(404);
            throw new Error('Product not created');
        }
        res.status(201).json(newProduct);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @private for admins
 * PUT request
 * @route /api/products/:id
 * Controller to update a product
 */
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, image, brand, category, countInStock } = req.body;
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        const updatedProduct = yield product.save();
        if (!exports.updateProduct) {
            res.status(500);
            throw new Error('Failed to update product');
        }
        res.status(201).json(updatedProduct);
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
/**
 * @protected
 * POST request
 * @route /api/products/:id/reviews
 * Controller to add a product review
 */
exports.createProductReview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, comment } = req.body;
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        const productUpdated = yield product.save();
        if (!productUpdated) {
            res.status(400);
            throw new Error('Review failed');
        }
        res.status(201).json({ message: 'Review added' });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
}));
