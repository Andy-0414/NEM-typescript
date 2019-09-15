import { Router } from "express";
import { Login, GetProfile, ChangePassword, Register, WithdrawAccount, ChangeInfomation } from "./auth.controller";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";

const router = Router();

// Routers
router.post("/register", Register);
router.post("/login", Login);
router.post("/getProfile", PassportJWTAuth.authenticate(), GetProfile);
router.post("/changePassword", PassportJWTAuth.authenticate(), ChangePassword);
router.post("/changeInformation", PassportJWTAuth.authenticate(), ChangeInfomation);
router.post("/withdrawAccount", PassportJWTAuth.authenticate(), WithdrawAccount);

export default router;
