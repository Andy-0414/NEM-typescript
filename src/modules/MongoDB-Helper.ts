import * as mongoose from "mongoose";
import Log from "./Logger";
class DB {
	/**
	 * @description MongoDB 활성화
	 * @param {string}url MongoDB URL
	 */
	public init(url?: string) {
		mongoose.connection.on("error", () => {
			Log.e("MongoDB Connect Fail");
		});
		mongoose.connection.once("open", () => {
			Log.c("MongoDB Connect Success");
		});
		mongoose.connect(url || process.env.DB_URL || "mongodb://localhost/NEM-TEMPLATE", { useNewUrlParser: true });
	}
}
export default new DB();
