import { Router } from "express";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";
import { Write, GetMyPosts } from "./post.controller";

const router = Router();

// Routers
router.post("/write", PassportJWTAuth.authenticate(), Write);
router.get("/getMyPosts", PassportJWTAuth.authenticate(), GetMyPosts);

export default router;
