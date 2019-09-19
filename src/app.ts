import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
import * as compression from "compression";
import * as morgan from "morgan";

import "dotenv/config";

import DB from "./modules/MongoDB-Helper";
import Log from "./modules/Logger";
import SendRule from "./modules/Send-Rule";
import Router from "./routers/index";
import PassportJWTAuth from "./modules/PassportJWT-Auth";

const app: express.Application = express(); // 서버 객체
app.listen(process.env.PORT || 3000, () => {
	// 서버가 열렸을 시 콜백
	Log.c("SERVER OPEN");
	Log.c(`PORT : ${process.env.PORT || 3000}`);
});

DB.init(); // DB 세팅

app.use(morgan("dev")); // 개발용 로그 미들웨어
app.use(cors()); // CORS 설정 미들웨어
app.use(helmet()); // 보안 미들웨어
app.use(compression()); // 데이터 압축 미들웨어
app.use(PassportJWTAuth.getInitialize()); // Passport 기본 세팅 미들웨어

app.use(express.static("public")); // public 폴더의 파일을 제공함
app.use(express.urlencoded()); // urlencode 지원
app.use(express.json()); // json 지원

app.get("/page", (req, res) => {
	res.sendfile("public/page.html");
}); // TEST CODE

app.use(Router); // 라우터 연결
app.use(SendRule.autoErrorHandler()); // 에러 핸들링

export default app;
