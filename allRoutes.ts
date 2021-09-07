import { Router } from "express";
import routePath from "./org/r1/routes/index";
const router = Router();
router.use("/r1", routePath);
export default router;
