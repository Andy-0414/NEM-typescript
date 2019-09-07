import { Router, Request, Response } from "express";
import { Login } from "./auth.controller";

const router = Router();

router.post("/login", Login);

export default router;
