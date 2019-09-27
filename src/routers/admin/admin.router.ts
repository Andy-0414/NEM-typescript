import { Router } from "express";
import { Page } from "./admin.controller";

const router = Router();

// Routers
router.get("/", Page);

export default router;
