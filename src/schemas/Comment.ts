import { Document, Schema, Model, model } from "mongoose";
import { ObjectID } from "bson";
import { IUserSchema } from "./User";

/**
 * @description Comment 요구 데이터
 */
export interface IComment {
	post: ObjectID; // 글
	owner: ObjectID; // 주인
	message: string; // 내용
	createAt: Date; // 생성일
}
/**
 * @description Comment 스키마에 대한 메서드 ( 레코드 )
 */
export interface ICommentSchema extends IComment, Document {
	/**
	 * @description 이 댓글의 주인인지 체크합니다.
	 * @returns {Promise<boolean>} 주인 여부를 반환합니다.
	 */
	ownerCheck(data: IUserSchema): boolean;
}
/**
 * @description Comment 모델에 대한 정적 메서드 ( 테이블 )
 */
export interface ICommentModel extends Model<ICommentSchema> {}

const CommentSchema: Schema = new Schema({
	post: { type: ObjectID, required: true, ref: "Post" },
	owner: { type: ObjectID, required: true, ref: "User" },
	message: { type: String, default: "" },
	createAt: { type: Date, default: Date.now }
});

CommentSchema.methods.ownerCheck = function(this: ICommentSchema, data: IUserSchema): boolean {
	return data._id.equals(this.owner);
};

export default model<ICommentSchema>("Comment", CommentSchema) as ICommentModel;
