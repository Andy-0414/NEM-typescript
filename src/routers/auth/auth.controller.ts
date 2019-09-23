import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserSchema, IUserChangePassword } from "../../schemas/User";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";

/**
 * @description 회원가입 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Register = (req: Request, res: Response, next: NextFunction) => {
	let data: IUser = req.body as IUser;
	if (User.dataCheck(data)) {
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
	let user: IUserSchema = req.user as IUserSchema;
	if ("newPassword" in req.body) {
		data.newPassword = req.body.newPassword;
		user.changePassword(data)
			.then(user => {
				SendRule.response(res, 200, user.getUserToken(), "비밀번호 변경 성공");
			})
			.catch(err => next(err));
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
/**
 * @description 비밀번호 외의 다른 정보를 변경하는 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const ChangeInfomation = (req: Request, res: Response, next: NextFunction) => {
	let data: any = req.body;
	let user: IUserSchema = req.user as IUserSchema;
	user.changeInfomation(data)
		.then(user => {
			SendRule.response(res, 200, undefined, "정보 변경 성공");
		})
		.catch(err => next(err));
};

/**
 * @description 회원 탈퇴 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const WithdrawAccount = (req: Request, res: Response, next: NextFunction) => {
	let user: IUserSchema = req.user as IUserSchema;

	user.withdrawAccount()
		.then(() => {
			SendRule.response(res, HTTPRequestCode.OK, undefined, "계정 삭제 성공");
		})
		.catch(err => next(err));
};
