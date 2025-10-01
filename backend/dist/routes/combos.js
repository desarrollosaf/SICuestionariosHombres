"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const combos_1 = require("../controllers/combos");
const router = (0, express_1.Router)();
router.get("/api/combos/getdependencias", combos_1.getdependencias);
exports.default = router;
