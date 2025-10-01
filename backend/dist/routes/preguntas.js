"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cuestionarios_1 = require("../controllers/cuestionarios");
const router = (0, express_1.Router)();
router.get("/api/preguntas/getpreguntas/:id", cuestionarios_1.getpreguntas);
router.post('/api/preguntas/savecuestionario/:id', cuestionarios_1.savecuestionario);
router.get("/api/preguntas/getcuestionarios", cuestionarios_1.getcuestionarios);
router.post("/api/preguntas/getcuestionariosdep", cuestionarios_1.getcuestionariosdep);
router.get("/api/preguntas/gettotalesdep", cuestionarios_1.gettotalesdep);
router.get("/api/preguntas/getcuestionariosus", cuestionarios_1.getcuestionariosus);
//router.post("/api/preguntas/getExcelFaltantes", getExcelFaltantes)
router.get("/api/preguntas/getExcel", cuestionarios_1.getExcel);
exports.default = router;
