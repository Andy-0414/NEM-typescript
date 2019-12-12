import { Request, Response, NextFunction } from "express";

export const Page = (req: Request, res: Response, next: NextFunction) => {
	res.sendFile("public/admin/index.html");
};
