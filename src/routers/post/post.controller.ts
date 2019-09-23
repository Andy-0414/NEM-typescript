import { Request, Response, NextFunction } from "express";
import { IUserSchema } from "../../schemas/User";
import Post, { IPost, IPostSchema } from "../../schemas/Post";
import SendRule, { StatusError, HTTPRequestCode } from "../../modules/Send-Rule";
import * as fs from "fs";

/**
 * @description 글쓰기 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Write = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let data = req.body as IPost;
	let imageData = req.body.img as string; // img
	if (Post.dataCheck(data)) {
		if (imageData) {
			// img
			let imageBuffer = Buffer.from(imageData, "base64");
			delete req.body.image;
			Post.createPost(user, data)
				.then((post: IPostSchema) => {
					post.imgPath = `post/${post._id}.jpg`;
					fs.writeFile(`public/${post.imgPath}`, imageBuffer, err => {
						if (err) next(err);
						post.save()
							.then(post => {
								SendRule.response(res, HTTPRequestCode.CREATE, post, "글 작성 성공");
							})
							.catch(err => next(err));
					});
				})
				.catch(err => next(err));
		} else {
			Post.createPost(user, data)
				.then((post: IPostSchema) => {
					SendRule.response(res, HTTPRequestCode.CREATE, post, "글 작성 성공");
				})
				.catch(err => next(err));
		}
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
/**
 * @description 내 글을 반환하는 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetMyPosts = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	Post.findByOwner(user)
		.then((posts: IPostSchema[]) => {
			SendRule.response(res, HTTPRequestCode.OK, posts);
		})
		.catch(err => next(err));
};
/**
 * @description 글수정 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Modification = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let data = req.body;
	if ("_id" in data) {
		Post.findByID(data._id).then(post => {
			if (post.ownerCheck(user)) {
				post.changeInfomation(data)
					.then(post => {
						SendRule.response(res, 200, post, "글 수정 성공");
					})
					.catch(err => next(err));
			} else {
				SendRule.response(res, HTTPRequestCode.FORBIDDEN, undefined, "권한 없음");
			}
		});
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
/**
 * @description 글삭제 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const Delete = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let data = req.body;
	if ("_id" in data) {
		Post.findByID(data._id).then(post => {
			if (post.ownerCheck(user)) {
				post.removePost()
					.then((post: IPostSchema) => {
						if (post.imgPath) {
							fs.unlink(`public/${post.imgPath}`, err => {
								if (err) next(err);
								SendRule.response(res, 200, post, "글 제거 성공");
							});
						} else {
							SendRule.response(res, 200, post, "글 제거 성공");
						}
					})
					.catch(err => next(err));
			} else {
				SendRule.response(res, HTTPRequestCode.FORBIDDEN, undefined, "권한 없음");
			}
		});
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
