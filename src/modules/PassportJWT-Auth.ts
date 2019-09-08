import * as passport from "passport";
import * as crypto from "crypto";
import { Handler } from "express";
import { StrategyOptions, Strategy, ExtractJwt } from "passport-jwt";

import User, { IUser } from "../schemas/User";

class PassportJWTManager {
	private option: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.SECRET_KEY || "SECRET"
	};
	private initialize: Handler;

	constructor() {
		passport.use(
			new Strategy(this.option, (data: IUser, done) => {
				User.loginValidation(data)
					.then(user => {
						done(null, user);
					})
					.catch(err => {
						done(err);
					});
			})
		);
		this.initialize = passport.initialize();
	}
	public getInitialize(): Handler {
		return this.initialize;
	}
	public authenticate(): Handler {
		return passport.authenticate("jwt", {
			failWithError: true,
			session: false
		});
	}
	public setOption(option: StrategyOptions): void {
		this.option = option;
	}
}

export default new PassportJWTManager();
