"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_middleware_1 = require("./../middlewares/admin.middleware");
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const product_middleware_1 = require("../middlewares/product.middleware");
const router = express_1.default.Router();
router.post('/', user_middleware_1.protectUserRoutes, order_controller_1.addOrderItems);
router.get('/', user_middleware_1.protectUserRoutes, admin_middleware_1.protectAdminRoutes, order_controller_1.getOrders);
router.get('/myorders', user_middleware_1.protectUserRoutes, order_controller_1.getMyOrders);
router.get('/:id', user_middleware_1.protectUserRoutes, order_controller_1.getOrderById);
router.put('/:id/pay', user_middleware_1.protectUserRoutes, product_middleware_1.reduceCountInStock, order_controller_1.updateOrderToPaid);
router.put('/:id/deliver', user_middleware_1.protectUserRoutes, admin_middleware_1.protectAdminRoutes, order_controller_1.updateOrderToDelivered);
exports.default = router;
