"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_middleware_1 = require("./../middlewares/user.middleware");
const admin_middleware_1 = require("./../middlewares/admin.middleware");
const express_1 = __importDefault(require("express"));
const product_controllers_1 = require("../controllers/product.controllers");
const router = express_1.default.Router();
router.get('/', product_controllers_1.getProducts);
router.get('/:id', product_controllers_1.getProductById);
router.delete('/:id', user_middleware_1.protectUserRoutes, admin_middleware_1.protectAdminRoutes, product_controllers_1.deleteProduct);
router.post('/', user_middleware_1.protectUserRoutes, admin_middleware_1.protectAdminRoutes, product_controllers_1.createProduct);
router.put('/:id', user_middleware_1.protectUserRoutes, admin_middleware_1.protectAdminRoutes, product_controllers_1.updateProduct);
router.post('/:id/reviews', user_middleware_1.protectUserRoutes, product_controllers_1.createProductReview);
exports.default = router;
