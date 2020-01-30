import { IUserSchema } from "../../schemas/User";
import Post from "../../schemas/Post";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { Request, Response, NextFunction } from "express";
import Comment, { ICommentSchema, IComment } from "../../schemas/Comment";
import { ObjectID } from "bson";

/**
 * @description 이 글의 모든 댓글을 가져옵니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetComments = function(req: Request, res: Response, next: NextFunction) {
	let data = req.body as { _postid: ObjectID };
	if (!("_postid" in data)) {
		return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
	Comment.find({ post: data._postid })
		.then(comments => {
			if (comments) {
				SendRule.response(res, HTTPRequestCode.CREATE, comments, "댓글 가져오기 성공");
			} else {
				return next(new StatusError(HTTPRequestCode.NOT_FOUND, "댓글이 존재하지 않음"));
			}
		})
		.catch(err => next(err));
};

/**
 * @description 댓글 작성 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const CommentWrite = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let data = req.body as ICommentSchema | { _postid: ObjectID };
	if (!("_postid" in data)) {
		return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
	Post.findOne({ _id: data._postid })
		.then(post => {
			if (post) {
				let comment = new Comment(data);
				comment.owner = user._id;
				comment
					.save()
					.then(comment => {
						SendRule.response(res, HTTPRequestCode.CREATE, comment, "댓글 작성 성공");
					})
					.catch(err => next(err));
			} else {
				return next(new StatusError(HTTPRequestCode.NOT_FOUND, "존재하지 않는 글"));
			}
		})
		.catch(err => next(err));
};

/**
 * @description 댓글 삭제 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const CommentDelete = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let data = req.body as ICommentSchema | { _id: ObjectID };
	if (!("_id" in data)) {
		return next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
	Comment.findOne({ _id: data._id })
		.then(comment => {
			if (comment) {
				if (comment.ownerCheck(user)) {
					comment
						.remove()
						.then(comment => {
							SendRule.response(res, HTTPRequestCode.OK, comment, "댓글 삭제 성공");
						})
						.catch(err => next(err));
				} else {
					return SendRule.response(res, HTTPRequestCode.FORBIDDEN, undefined, "권한 없음");
				}
			} else {
				return next(new StatusError(HTTPRequestCode.NOT_FOUND, "존재하지 않는 댓글"));
			}
		})
		.catch(err => next(err));
};
