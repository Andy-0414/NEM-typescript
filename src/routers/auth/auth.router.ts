import { Router, Request, Response } from "express";
import User, { IUser } from "../../schemas/User";

const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.send("Hello");
});

export default router;
