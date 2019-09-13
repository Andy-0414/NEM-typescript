import * as mongoose from "mongoose";
import Log from "./Logger";
class DB {
	private isDatabaseConnect: boolean = false;
	private db: mongoose.Connection;
	/**
	 * @description MongoDB 활성화
	 * @param {string}url MongoDB URL
	 */
	public init(url?: string): void {
		this.db = mongoose.connection;
		this.db.on("error", () => {
			Log.e("MongoDB Connect Fail");
			this.isDatabaseConnect = false;
		});
		this.db.once("open", () => {
			Log.c("MongoDB Connect Success");
			this.isDatabaseConnect = true;
		});
		mongoose.set("useCreateIndex", true);
		mongoose.connect(url || process.env.DB_URL || "mongodb://localhost/NEM-TEMPLATE", { useNewUrlParser: true });
	}
	/**
	 * @description DB 연결 여부 확인
	 * @returns {boolean} DB 연결 여부
	 */
	public isDBConnect(): boolean {
		return this.isDatabaseConnect;
	}
	/**
	 * @description DB 객체 반환
	 * @returns {mongoose.Connection} DB 객체
	 */
	public getDB(): mongoose.Connection {
		return this.db;
	}
}
export default new DB();
