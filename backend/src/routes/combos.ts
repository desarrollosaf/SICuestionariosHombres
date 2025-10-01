import { Router } from "express";
import { getdependencias } from "../controllers/combos";

const router = Router();

router.get("/api/combos/getdependencias", getdependencias)


export default router