import chalk from "chalk";
import * as moment from "moment";
import "moment-timezone";
moment.tz.setDefault("Asia/Seoul");
export default {
	/**
	 * @description 현재 시간을 가져옵니다.
	 * @returns {string} 현재 시간을 문자열로 반환 ( YYYY-MM-DD HH:mm:ss )
	 */
	getTime(): string {
		return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
	},
	_defaultLogFormat(str: string): boolean {
		console.log(chalk.grey(`[${this.getTime()}] `) + str);
		return true;
	},
	/**
	 * @description 디버그 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	d(str: string): boolean {
		return this._defaultLogFormat(chalk.underline.cyan(str));
	},
	/**
	 * @description 정보 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	i(str: string): boolean {
		return this._defaultLogFormat(chalk.white(str));
	},
	/**
	 * @description 성공 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	c(str: string): boolean {
		return this._defaultLogFormat(chalk.green(str));
	},
	/**
	 * @description 경고 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	w(str: string): boolean {
		return this._defaultLogFormat(chalk.yellow(str));
	},
	/**
	 * @description 에러 로그입니다.
	 * @param {string} 출력 문자열
	 * @returns {boolean} 성공 여부
	 */
	e(str: string): boolean {
		return this._defaultLogFormat(chalk.red(str));
	}
};