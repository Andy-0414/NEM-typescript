import { Router } from "express";
import { Login, GetProfile, ChangePassword, Register, WithdrawAccount } from "./auth.controller";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/getProfile", PassportJWTAuth.authenticate(), GetProfile);
router.post("/changePassword", PassportJWTAuth.authenticate(), ChangePassword);
router.post("/withdrawAccount", PassportJWTAuth.authenticate(), WithdrawAccount);

export default router;
