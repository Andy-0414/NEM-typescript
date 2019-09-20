import { Router } from "express";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";
import { Write, GetMyPosts, Modification, Delete } from "./post.controller";

const router = Router();

// Routers
router.post("/write", PassportJWTAuth.authenticate(), Write);
router.get("/getMyPosts", PassportJWTAuth.authenticate(), GetMyPosts);
router.post("/modification", PassportJWTAuth.authenticate(), Modification);
router.post("/delete", PassportJWTAuth.authenticate(), Delete);

export default router;
