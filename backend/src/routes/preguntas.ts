import { Router } from "express";

import { getcuestionarios, getcuestionariosdep, getcuestionariosus,getExcel, getpreguntas, gettotalesdep, savecuestionario } from "../controllers/cuestionarios";

const router = Router();

router.get("/api/preguntas/getpreguntas/:id", getpreguntas)
router.post('/api/preguntas/savecuestionario/:id', savecuestionario)
router.get("/api/preguntas/getcuestionarios", getcuestionarios)
router.post("/api/preguntas/getcuestionariosdep", getcuestionariosdep)
router.get("/api/preguntas/gettotalesdep", gettotalesdep)
router.get("/api/preguntas/getcuestionariosus", getcuestionariosus)
//router.post("/api/preguntas/getExcelFaltantes", getExcelFaltantes)
router.get("/api/preguntas/getExcel", getExcel)

export default router