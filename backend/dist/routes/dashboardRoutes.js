"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All dashboard routes require authentication
router.use(auth_1.authenticate);
router.get('/summary', dashboardController_1.getSummary);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map