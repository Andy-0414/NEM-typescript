import * as request from "supertest";
import app from "./app";
describe("DB CONNECT", function() {
	describe("GET /", () => {
		it("SERVER_ON", done => {
			request(app)
				.get("/")
				.end(err => {
					if (err) {
						done(err);
						return;
					}
					done();
				});
		});
	});
	describe("POST /", function() {
		it("LOGIN_TEST", done => {
			request(app)
				.post("/auth/login")
				.send({
					email: "pjh8667@naver.com",
					password: "andy"
				})
				.end(err => {
					if (err) {
						done(err);
						return;
					}
					done();
				});
		});
	});
});
