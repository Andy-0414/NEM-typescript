import { Router } from "express";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";
import { CommentWrite, CommentDelete } from "./comment.controller";

const router = Router();

// Routers
router.post("/commentWritete", PassportJWTAuth.authenticate(), CommentWrite);
router.get("/CommentDelete", PassportJWTAuth.authenticate(), CommentDelete);

export default router;
