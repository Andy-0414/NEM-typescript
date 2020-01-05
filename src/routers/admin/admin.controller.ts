import { Request, Response, NextFunction } from "express";

/**
 * @description 정적 파일 제공 테스트 페이지
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Page = (req: Request, res: Response, next: NextFunction) => {
	res.sendFile("public/admin/index.html");
};
