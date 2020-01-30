import { Router } from "express";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";
import { CommentWrite, CommentDelete, GetComments } from "./comment.controller";

const router = Router();

// Routers
router.post("/getComments", GetComments);
router.post("/commentWritete", PassportJWTAuth.authenticate(), CommentWrite);
router.post("/commentDelete", PassportJWTAuth.authenticate(), CommentDelete);

export default router;
