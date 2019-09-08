import { Router } from "express";
import { Login, GetProfile } from "./auth.controller";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";

const router = Router();

router.post("/login", Login);
router.post("/getProfile", PassportJWTAuth.authenticate(), GetProfile);

export default router;
