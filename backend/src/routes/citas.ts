import { Router } from "express";
import { getCita, getcitasagrupadas, getHorariosDisponibles, savecita } from "../controllers/citas";

const router = Router();

router.get("/api/citas/gethorarios/:fecha", getHorariosDisponibles )
router.post("/api/citas/savecita/", savecita)
router.get("/api/citas/citasagrupadas/", getcitasagrupadas) 
router.get("/api/citas/getcitaservidor/:id", getCita) 


export default router