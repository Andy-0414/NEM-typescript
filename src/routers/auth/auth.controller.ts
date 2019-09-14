import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserChangePassword } from "../../schemas/User";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import Log from "../../modules/Logger";

/**
 * @description 회원가입 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Register = (req: Request, res: Response, next: NextFunction) => {
	let data: IUser = req.body as IUser;
	if (User.dataCheck(data) && "nickname" in data) {
		User.checkPresentAccount(data.email)
			.then(check => {
				if (!check) {
					User.createUser(data)
						.then(data => {
							SendRule.response(res, HTTPRequestCode.CREATE, data.getUserToken(), "회원가입 성공");
						})
						.catch(err => next(err));
				} else {
					next(new StatusError(HTTPRequestCode.BAD_REQUEST, "이미 있는 계정"));
				}
			})
			.catch(err => next(err));
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};

/**
 * @description 로그인 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Login = (req: Request, res: Response, next: NextFunction) => {
	let data: IUser = req.body as IUser;
	if (User.dataCheck(data)) {
		User.loginValidation(data, true)
			.then(data => {
				SendRule.response(res, HTTPRequestCode.OK, data.getUserToken(), "로그인 성공");
			})
			.catch(err => {
				next(err);
			});
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};

/**
 * @description 토큰을 이용한 프로필 가져오기 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetProfile = (req: Request, res: Response) => {
	Log.c("GetProfile : " + (req.user as IUser).email);
	SendRule.response(res, 200, req.user);
};

/**
 * @description 비밀번호 변경 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const ChangePassword = (req: Request, res: Response, next: NextFunction) => {
	let data: IUserChangePassword = req.user as IUserChangePassword;
	if ("newPassword" in req.body) {
		data.newPassword = req.body.newPassword;
		User.findByEmail((req.user as IUser).email)
			.then(user => {
				user.changePassword(data)
					.then(user => {
						SendRule.response(res, 200, user.getUserToken(), "비밀번호 변경 성공");
					})
					.catch(err => next(err));
			})
			.catch(err => next(err));
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};

/**
 * @description 회원 탈퇴 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const WithdrawAccount = (req: Request, res: Response, next: NextFunction) => {
	User.findByEmail((req.user as IUser).email)
		.then(user => {
			user.withdrawAccount()
				.then(() => {
					SendRule.response(res, HTTPRequestCode.OK, undefined, "계정 삭제 성공");
				})
				.catch(err => next(err));
		})
		.catch(err => next(err));
};
