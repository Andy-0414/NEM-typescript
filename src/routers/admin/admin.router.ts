import { Router } from "express";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";
import { Page } from "./admin.controller";

const router = Router();

// Routers
router.get("/", Page);

export default router;
