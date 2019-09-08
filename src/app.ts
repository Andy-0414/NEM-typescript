import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";

import "dotenv/config";

import DB from "./modules/MongoDB-Helper";
import Log from "./modules/Logger";
import SendRule, { HTTPRequestCode } from "./modules/Send-Rule";
import Router from "./routers/index";

const app: express.Application = express();
app.listen(process.env.PORT || 3000, () => {
	Log.c("CLEAR");
});

DB.init();

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(Router);

app.use(SendRule.autoErrorHandler())
