import { Document, Schema, Model, model, DocumentQuery } from "mongoose";
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
	nickname?: string;
	lastLogin?: Date;
	createAt?: Date;
	salt?: string;
}
export interface IUserChangePassword extends IUser {
	newPassword: string;
}
/**
 * @description User 스키마에 대한 메서드 ( 레코드 )
 */
export interface IUserSchema extends IUser, Document {
	/**
	 * @description 이 유저에 대한 토큰을 생성합니다.
	 * @returns {string} 이 유저에 대한 토큰을 반홚바니다.
	 */
	getUserToken(): string;
	/**
	 * @description 이 유저의 비밀번호를 변경합니다.
	 * @param {IUserSchema}data newPassword 필드에 바꿀 비밀번호를 입력
	 * @returns {Promise<IUserSchema>} 작업이 완료 된 후 그 유저를 반환합니다.
	 */
	changePassword(data: IUserChangePassword): Promise<IUserSchema>;
	/**
	 * @description 이 유저의 정보를 반환합니다.
	 * @param {IUser}data 유저의 바꿀 정보
	 * @returns {Promise<IUserSchema>} 작업이 완료된 후 그 유저를 반환합니다.
	 */
	changeInfomation(data: IUser): Promise<IUserSchema>;
	/**
	 * @description 이 유저의 계정을 삭제합니다.
	 * @returns {Promise<boolean>} 성공 여부를 반환합니다.
	 */
	withdrawAccount(): Promise<boolean>;
	/**
	 * @description 로그인 시간을 갱신합니다.
	 * @returns {Promise<IUserSchema>} 작업이 완료 된 후 그 유저를 반환합니다.
	 */
	updateLoginTime(): Promise<IUserSchema>;
}
/**
 * @description User 모델에 대한 정적 메서드 ( 테이블 )
 */
export interface IUserModel extends Model<IUserSchema> {
	/**
	 * @description email과 password 필드의 유효성을 검사합니다.
	 * @param {any}data 체크 할 객체
	 * @returns {boolean} 유효성 결과
	 */
	dataCheck(data: any): boolean;
	/**
	 * @description 유저가 로그인이 가능한지 확인합니다.
	 * @param data 유효성 검사 유저
	 * @param {boolean}first 최초 로그인 시 (비밀번호가 암호화 되지 않았을 시)
	 * @returns {Promise<IUserSchema>} 성공 시 그 유저를 반환합니다.
	 */
	loginValidation(data: IUser, first?: boolean): Promise<IUserSchema>;
	/**
	 * @description 입력받은 유저의 토큰을 생성합니다.
	 * @returns {string} 입력받은 유저에 대한 토큰
	 */
	getToken(data: IUserSchema): string;
	/**
	 * @description 암호화 할 비밀번호를 입력받아 비밀번호와 암호화 키를 반환합니다.
	 * @param {string}password 암호화 할 비밀번호
	 * @returns {Promise<PasswordAndSalt>} 비밀번호와 암호화 키를 반환합니다.
	 */
	createPassword(password: string): Promise<PasswordAndSalt>;
	/**
	 * @description 유저를 생성한 후 그 유저를 반환합니다.
	 * @param {IUser}data 생성할 유저 데이터
	 * @returns {Promise<IUserSchema>} 입력받은 데이터에 대한 유저입니다.
	 */
	createUser(data: IUser): Promise<IUserSchema>;
	/**
	 * @description 이메일을 입력받아 일치하는 유저를 반환합니다.
	 * @param {string}email 찾을 유저의 이메일
	 * @returns {Promise<IUserSchema>} 일치하는 유저를 반환합니다.
	 */
	findByEmail(email: string): Promise<IUserSchema>;
	/**
	 * @description 이메일을 입력받아 계정의 유무를 반환합니다.
	 * @param email 검사 할 유저의 이메일
	 * @returns {boolean} 계정의 유무를 반환합니다.
	 */
	checkPresentAccount(email: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	nickname: { type: String },
	lastLogin: { type: Date, default: Date.now },
	createAt: { type: Date, default: Date.now },
	salt: { type: String, default: process.env.SECRET_KEY || "SECRET" }
});
UserSchema.methods.getUserToken = function(this: IUserSchema): string {
	return (this.constructor as IUserModel).getToken(this);
};
UserSchema.methods.changePassword = function(this: IUserSchema, data: IUserChangePassword): Promise<IUserSchema> {
	return new Promise<IUserSchema>((resolve, reject) => {
		(this.constructor as IUserModel)
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
UserSchema.methods.changeInfomation = function(this: IUserSchema, data: IUser): Promise<IUserSchema> {
	Object.keys(data).forEach(x => {
		if (x in this && (x != "email" && x != "_id" && x != "password" && x != "salt" && x != "createAt"))
			this[x] = data[x] || this[x];
	});
	return this.save();
};
UserSchema.methods.withdrawAccount = function(this: IUserSchema): Promise<any> {
	return this.remove();
};
UserSchema.methods.updateLoginTime = function(this: IUserSchema): Promise<IUserSchema> {
	this.lastLogin = new Date();
	return this.save();
};

UserSchema.statics.dataCheck = function(this: IUserModel, data: any): boolean {
	return "email" in data && "password" in data;
};
UserSchema.statics.loginValidation = function(
	this: IUserModel,
	data: IUser,
	first: boolean = false
): Promise<IUserSchema> {
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
type EMPW = { email: string; password: string };
UserSchema.statics.getToken = function(this: IUserModel, data: IUser): string {
	let user = {
		email: data.email,
		password: data.password
	};
	return "Bearer " + jwt.encode(user, process.env.SECRET_KEY || "SECRET");
};
UserSchema.statics.createPassword = function(this: IUserModel, password: string): Promise<PasswordAndSalt> {
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
UserSchema.statics.createUser = function(this: IUserModel, data: IUser): Promise<IUserSchema> {
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
UserSchema.statics.findByEmail = function(this: IUserModel, email: string): Promise<IUserSchema> {
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
UserSchema.statics.checkPresentAccount = async function(this: IUserModel, email: string): Promise<boolean> {
	let data = await this.findOne({ email });
	if (data) return true;
	else return false;
};
export default model<IUserSchema>("User", UserSchema) as IUserModel;
