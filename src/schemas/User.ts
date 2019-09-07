import { Document, Schema, Model, model, mongo } from "mongoose";
import * as crypto from "crypto";
import * as jwt from "jwt-simple";

/**
 * @description User 요구 데이터 \\
 */
export interface IUser {
	email: string;
	password: string;
	nickname: string;
	lastLogin?: Date;
	createAt?: Date;
	salt?: string;
}
/**
 * @description User 스키마에 대한 메서드
 */
export interface IUserSchema extends IUser, Document {}
/**
 * @description User 모델에 대한 정적 메서드
 */
export interface IUserModel extends Model<IUserSchema> {
	dataCheck(data: any): boolean;
	createUser(data: IUser): Promise<IUserSchema>;
	getAll(): Promise<IUserSchema[]>;
	deleteAll(): Promise<void>;
	loginValidation(data: IUser, first?: boolean): Promise<IUserSchema>;
	getToken(data: IUserSchema): string;
}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	nickname: { type: String, required: true },
	password: { type: String, required: true },
	lastLogin: { type: Date, default: Date.now },
	createAt: { type: Date, default: Date.now },
	salt: { type: String, default: process.env.SECRET_KEY || "SECRET" }
});
UserSchema.statics.dataCheck = function(data: any): boolean {
	return "email" in data && "password" in data;
};
UserSchema.statics.loginValidation = function(data: IUser, first: boolean = false): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		this.findOne({ email: data.email })
			.then((user: IUserSchema) => {
				if (user) {
					crypto.pbkdf2(data.password, user.salt, 10000, 64, "sha512", (err, key) => {
						if (err) reject(err);
						if (key.toString("base64") == user.password || (data.password == user.password && first)) {
							resolve(user);
						} else {
							reject(new Error("비밀번호가 일치하지 않습니다."));
						}
					});
				} else {
					reject(new Error("계정이 존재하지 않습니다."));
				}
			})
			.catch(err => {
				reject(err);
			});
	});
};
UserSchema.statics.getToken = function(data: IUserSchema): string {
	let user = {
		email: data.email,
		password: data.password
	};
	return "Bearer " + jwt.encode(user, process.env.SECRET_KEY || "SECRET");
};

UserSchema.statics.createUser = function(data: IUser): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		crypto.randomBytes(64, (err: Error, buf: Buffer) => {
			if (err) reject(err);
			let salt = buf.toString("base64");
			data.salt = salt;
			crypto.pbkdf2(data.password, salt, 10000, 64, "sha512", (err: Error, key: Buffer) => {
				if (err) reject(err);
				data.password = key.toString("base64");
				let user = new this(data);
				user.save()
					.then((data: IUserSchema) => {
						resolve(data);
					})
					.catch((err: Error) => {
						reject(err);
					});
			});
		});
	});
};
UserSchema.statics.getAll = function(): Promise<IUserSchema[]> {
	return this.find();
};
UserSchema.statics.deleteAll = function(): Promise<void> {
	return this.deleteMany();
};
export default model<IUserSchema>("User", UserSchema) as IUserModel;
