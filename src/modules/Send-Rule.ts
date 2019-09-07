import { Response } from "express";

export enum HTTPRequestCode {
	OK = 200,
	CREATE = 201,
	ACCEPTED = 202,

	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,

	INTERNAL_SERVER_ERROR = 500
}
class SendRule {
	/**
	 * @description 데이터 리스폰스 규격
	 * @param {Response} res Express Response
	 * @param {number} status 상태 코드
	 * @param {any} data 전송할 데이터
	 * @param {string} message 메세지
	 * @param {boolean} result 성공 여부
	 */
	public response(res: Response, status: number | HTTPRequestCode, data?: any, message?: string, result: boolean = true) {
		res.status(status)
			.send({
				result,
				data,
				message
			})
			.end();
	}
}
export default new SendRule();
