import { Router } from "express";
import { Login, GetProfile, ChangePassword } from "./auth.controller";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";

const router = Router();

router.post("/login", Login);
router.post("/getProfile", PassportJWTAuth.authenticate(), GetProfile);
router.post("/changePassword", PassportJWTAuth.authenticate(), ChangePassword);

export default router;
