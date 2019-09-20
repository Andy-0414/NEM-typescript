import { Document, Schema, Model, model } from "mongoose";
import { ObjectID } from "bson";
import { IUserSchema } from "./User";

/**
 * @description Post 요구 데이터
 */
export interface IPost {
	owner?: ObjectID;
	title: string;
	content: string;
	createAt?: Date;
}
/**
 * @description Post 스키마에 대한 메서드 ( 레코드 )
 */
export interface IPostSchema extends IPost, Document {
	removePost(): Promise<any>;
	changeInfomation(data: IPost): Promise<IPostSchema>;
}
/**
 * @description Post 모델에 대한 정적 메서드 ( 테이블 )
 */
export interface IPostModel extends Model<IPostSchema> {
	dataCheck(data: any): boolean;
	createPost(owner: IUserSchema, data: IPost): Promise<IPostSchema>;
	findByOwner(owner: IUserSchema): Promise<IPostSchema[]>;
}

const PostSchema: Schema = new Schema({
	owner: { type: ObjectID, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	createAt: { type: Date, default: Date.now }
});

PostSchema.methods.removePost = function(this: IPostSchema): Promise<any> {
	return this.remove();
};
PostSchema.methods.changeInfomation = function(this: IPostSchema, data: IPost): Promise<IPostSchema> {
	Object.keys(data).forEach(x => {
		if (x in this && (x != "owner" && x != "createAt")) this[x] = data[x] || this[x];
	});
	return this.save();
};

PostSchema.statics.dataCheck = function(this: IPostSchema, data: any): boolean {
	return "title" in data && "content" in data;
};
PostSchema.statics.createPost = function(this: IPostModel, owner: IUserSchema, data: IPost): Promise<IPostSchema> {
	data.owner = owner._id;
	let post = new this(data);
	return new Promise((resolve, reject) => {
		post.save()
			.then((data: IPostSchema) => {
				resolve(data);
			})
			.catch(err => reject(err));
	});
};
PostSchema.statics.findByOwner = function(this: IPostModel, owner: IUserSchema): Promise<IPostSchema[]> {
	return new Promise((resolve, reject) => {
		this.find({ owner: owner._id })
			.then((data: IPostSchema[]) => {
				resolve(data);
			})
			.catch(err => reject(err));
	});
};

export default model<IPostSchema>("Post", PostSchema) as IPostModel;
