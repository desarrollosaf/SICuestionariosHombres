import { Router } from "express";
import { getHorariosDisponibles } from "../controllers/citas";

const router = Router();

router.get("/api/citas/gethorarios/:fecha", getHorariosDisponibles )


export default router