import * as mongoose from "mongoose";
import Log from "./Logger";
class DB {
	private isDatabaseConnect: boolean = false;
	/**
	 * @description MongoDB 활성화
	 * @param {string}url MongoDB URL
	 */
	public init(url?: string): void {
		mongoose.connection.on("error", () => {
			Log.e("MongoDB Connect Fail");
			this.isDatabaseConnect = false;
		});
		mongoose.connection.once("open", () => {
			Log.c("MongoDB Connect Success");
			this.isDatabaseConnect = true;
		});
		mongoose.set("useCreateIndex", true);
		mongoose.connect(url || process.env.DB_URL || "mongodb://localhost/NEM-TEMPLATE", { useNewUrlParser: true });
	}
	public isDBConnect(): boolean {
		return this.isDatabaseConnect;
	}
}
export default new DB();
