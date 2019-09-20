import { Request, Response, NextFunction } from "express";
import { IUserSchema } from "../../schemas/User";
import Post, { IPost, IPostSchema } from "../../schemas/Post";
import SendRule, { StatusError, HTTPRequestCode } from "../../modules/Send-Rule";

export const Write = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let data = req.body as IPost;
	if (Post.dataCheck(data)) {
		Post.createPost(user, data)
			.then((post: IPostSchema) => {
				SendRule.response(res, HTTPRequestCode.CREATE, post, "글 작성 성공");
			})
			.catch(err => next(err));
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
export const GetMyPosts = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	Post.findByOwner(user)
		.then((posts: IPostSchema[]) => {
			SendRule.response(res, HTTPRequestCode.OK, posts);
		})
		.catch(err => next(err));
};
