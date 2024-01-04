"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdminRoutes = void 0;
const protectAdminRoutes = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        throw new Error('You are not authorized as an admin');
    }
};
exports.protectAdminRoutes = protectAdminRoutes;
