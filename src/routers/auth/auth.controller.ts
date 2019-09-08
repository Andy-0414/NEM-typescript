import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserChangePassword } from "../../schemas/User";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import Log from "../../modules/Logger";

export const Login = (req: Request, res: Response, next: NextFunction) => {
	let data = req.body;
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
export const ChangePassword = (req: Request, res: Response, next: NextFunction) => {
	let data: IUserChangePassword = req.user as IUserChangePassword;
	if ("newPassword" in req.body) {
		data.newPassword = req.body.newPassword;
		User.findByEmail((req.user as IUser).email)
			.then(user => {
				user.changePassword(data)
					.then(user => {
						SendRule.response(res, 200, user.getUserToken());
					})
					.catch(err => next(err));
			})
			.catch(err => next(err));
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST));
	}
};
