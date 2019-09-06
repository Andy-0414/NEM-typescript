import * as express from "express";
import * as cors from "cors";

import Log from "./modules/logger";

const app: express.Application = express();

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello World!!");
});

app.listen(3000, () => {
	Log.c("CLEAR")
});
