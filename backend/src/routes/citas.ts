import { Router } from "express";
import { getHorariosDisponibles, savecita } from "../controllers/citas";

const router = Router();

router.get("/api/citas/gethorarios/:fecha", getHorariosDisponibles )
router.post("/api/citas/savecita/", savecita)


export default router