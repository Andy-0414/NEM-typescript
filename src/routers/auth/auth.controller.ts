import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../schemas/User";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import Log from "../../modules/Logger";

export const Login = (req: Request, res: Response, next: NextFunction) => {
	var data = req.body;
	if (User.dataCheck(data)) {
		User.loginValidation(data, true)
			.then(data => {
				SendRule.response(res, HTTPRequestCode.OK, User.getToken(data));
			})
			.catch(err => {
				next(err);
			});
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST));
	}
};
export const GetProfile = (req: Request, res: Response) => {
	Log.c("GetProfile : " + (req.user as IUser).email);
	SendRule.response(res, 200, req.user);
};
