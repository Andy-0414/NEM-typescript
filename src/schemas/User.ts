import { Document, Schema, Model, model, mongo, Mongoose } from "mongoose";
import * as crypto from "crypto";
import * as jwt from "jwt-simple";
import { StatusError, HTTPRequestCode } from "../modules/Send-Rule";

export interface PasswordAndSalt {
	password: string;
	salt: string;
}
/**
 * @description User 요구 데이터
 */
export interface IUser {
	email: string;
	password: string;
	nickname: string;
	lastLogin?: Date;
	createAt?: Date;
	salt?: string;
}
export interface IUserChangePassword extends IUser {
	newPassword: string;
}
/**
 * @description User 스키마에 대한 메서드
 */
export interface IUserSchema extends IUser, Document {
	getUserToken(): string;
	changePassword(data: IUserChangePassword): Promise<IUserSchema>;
	changeInfomation(data: IUser): Promise<IUserSchema>;
	withdrawAccount(): Promise<boolean>;
	updateLoginTime(): Promise<IUserSchema>;
}
/**
 * @description User 모델에 대한 정적 메서드
 */
export interface IUserModel extends Model<IUserSchema> {
	dataCheck(data: any): boolean;
	loginValidation(data: IUser, first?: boolean): Promise<IUserSchema>;
	getToken(data: IUserSchema): string;
	createPassword(password: string): Promise<PasswordAndSalt>;
	createUser(data: IUser): Promise<IUserSchema>;
	getAll(): Promise<IUserSchema[]>;
	deleteAll(): Promise<void>;
	findByEmail(email: string): Promise<IUserSchema>;
	checkPresentAccount(email: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	nickname: { type: String, required: true },
	password: { type: String, required: true },
	lastLogin: { type: Date, default: Date.now },
	createAt: { type: Date, default: Date.now },
	salt: { type: String, default: process.env.SECRET_KEY || "SECRET" }
});
UserSchema.methods.getUserToken = function(): string {
	return this.constructor.getToken({
		email: this.email,
		password: this.password
	});
};
UserSchema.methods.changePassword = function(data: IUserChangePassword): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		this.constructor
			.createPassword(data.newPassword)
			.then((passsalt: PasswordAndSalt) => {
				this.password = passsalt.password;
				this.salt = passsalt.salt;
				this.save()
					.then((data: IUserSchema) => {
						resolve(data);
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
};
UserSchema.methods.changeInfomation = function(data: IUser): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		Object.keys(data).forEach(x => {
			if (x != "email" && x != "password" && x != "salt") this[x] = data[x] || this[x];
		});
		this.save()
			.then((data: IUserSchema) => {
				resolve(data);
			})
			.catch(err => reject(err));
	});
};
UserSchema.methods.withdrawAccount = function(): Promise<any> {
	return this.remove();
};
UserSchema.methods.updateLoginTime = function(): Promise<IUserSchema> {
	this.lastLogin = new Date();
	return this.save();
};

UserSchema.statics.dataCheck = function(data: any): boolean {
	return "email" in data && "password" in data;
};
UserSchema.statics.loginValidation = function(data: IUser, first: boolean = false): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		this.findByEmail(data.email)
			.then((user: IUserSchema) => {
				user.updateLoginTime()
					.then(user => {
						if (first) {
							crypto.pbkdf2(data.password, user.salt, 10000, 64, "sha512", (err, key) => {
								if (err) reject(err);
								if (key.toString("base64") == user.password) {
									resolve(user);
								} else {
									reject(new StatusError(HTTPRequestCode.FORBIDDEN, "비밀번호가 일치하지 않습니다."));
								}
							});
						} else {
							if (data.password == user.password) {
								resolve(user);
							} else {
								reject(new StatusError(HTTPRequestCode.FORBIDDEN, "비밀번호가 일치하지 않습니다."));
							}
						}
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
};

UserSchema.statics.getToken = function(data: IUserSchema): string {
	let user = {
		email: data.email,
		password: data.password
	};
	return "Bearer " + jwt.encode(user, process.env.SECRET_KEY || "SECRET");
};
UserSchema.statics.createPassword = function(password: string): Promise<PasswordAndSalt> {
	let data: PasswordAndSalt = {
		password: "",
		salt: ""
	};
	return new Promise<PasswordAndSalt>((resolve, reject) => {
		crypto.randomBytes(64, (err: Error, buf: Buffer) => {
			if (err) reject(err);
			let salt = buf.toString("base64");
			data.salt = salt;
			crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err: Error, key: Buffer) => {
				if (err) reject(err);
				data.password = key.toString("base64");
				resolve(data);
			});
		});
	});
};
UserSchema.statics.createUser = function(data: IUser): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		this.createPassword(data.password)
			.then((passsalt: PasswordAndSalt) => {
				data.password = passsalt.password;
				data.salt = passsalt.salt;
				let user = new this(data);
				user.save()
					.then((data: IUserSchema) => {
						resolve(data);
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
};
UserSchema.statics.findByEmail = function(email: string): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		this.findOne({ email })
			.then((data: IUserSchema) => {
				if (data) {
					resolve(data);
				} else {
					reject(new Error("계정이 존재하지 않습니다."));
				}
			})
			.catch(err => reject(err));
	});
};
UserSchema.statics.checkPresentAccount = async function(email: string): Promise<boolean> {
	let data = await this.findOne({ email });
	if (data) return true;
	else return false;
};
UserSchema.statics.getAll = function(): Promise<IUserSchema[]> {
	return this.find();
};
UserSchema.statics.deleteAll = function(): Promise<void> {
	return this.deleteMany();
};
export default model<IUserSchema>("User", UserSchema) as IUserModel;
