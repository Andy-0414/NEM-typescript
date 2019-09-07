import { Request, Response } from "express";
import User, { IUser } from "../../schemas/User";

function isUser(object: any): object is IUser {
	return "email" in object;
}
export const Login = (req: Request, res: Response) => {
	var data = req.body;
	if (User.dataCheck(data)) {
		User.loginValidation(data, true)
			.then(data => {
				res.send(User.getToken(data));
			})
			.catch(err => {
				res.send(err.message);
			});
	} else {
		res.send("NOT DATA");
	}
};
