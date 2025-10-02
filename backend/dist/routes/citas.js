"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const citas_1 = require("../controllers/citas");
const router = (0, express_1.Router)();
router.get("/api/citas/gethorarios/:fecha", citas_1.getHorariosDisponibles);
router.post("/api/citas/savecita/", citas_1.savecita);
exports.default = router;
