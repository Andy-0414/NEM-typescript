import { Document, Schema, Model, model, mongo } from "mongoose";

/**
 * @description User 요구 데이터 입니다.
 */
export interface IUser {
	email: string;
	password: string;
	nickname: string;
	// lastLogin?: Date;
	// createAt?: Date;
}
/**
 * @description User 스키마에 대한 메서드입니다.
 */
export interface IUserSchema extends IUser, Document {}
/**
 * @description User 모델에 대한 정적 메서드입니다.
 */
export interface IUserModel extends Model<IUserSchema> {
	createUser(data: IUser): Promise<IUserModel>;
	getAll(): Promise<IUserModel[]>;
	deleteAll(): Promise<void>;
}

const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true },
	nickname: { type: String, required: true },
	password: { type: String, required: true },
	lastLogin: { type: Date, default: Date.now },
	createAt: { type: Date, default: Date.now }
});

UserSchema.statics.createUser = function(data: IUser): Promise<IUserModel> {
	let user = new this(data);
	return user.save();
};
UserSchema.statics.getAll = function(): Promise<IUserModel[]> {
	return this.find();
};
UserSchema.statics.deleteAll = function(): Promise<void> {
	return this.deleteMany();
};
export default model<IUserSchema>("User", UserSchema) as IUserModel;
