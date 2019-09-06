import * as express from "express";
import * as cors from "cors";

const app: express.Application = express();

app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello World!!");
});

app.listen(3000, () => {
	console.log("PORT:3000");
});