import { Response } from "express";
import { sign } from "jsonwebtoken";

import { User, UserModel } from "../typeDefs/userTypes";

export const createAccessToken = (user: User) => {
	return sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "7d",
	});
};

//EVERY 15 MINUTES, ACCESS TOKEN WILL BE REFRESHED BY
//CLIENT AND USER'S TOKEN VERSION WILL BE PASSED
//TO CHECK IF IT MATCHES THE TOKEN'S VERSION
export const createRefreshToken = (user: User) => {
	return sign(
		{ userId: user._id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn: "7d",
		}
	);
};

export const sendRefreshToken = (res: Response, token: string) => {
	res.cookie("jid", token, {
		httpOnly: true,
		//refresh token will only be sent to this route
		path: "/refresh_token",
	});
};

//We keep track of token version in case of forgetting password
//and getting hacked, which can be revoked by incrementing user's
//token version
export const revokeTokens = async (userId: number): Promise<boolean> => {
	await UserModel.findOneAndUpdate(
		{ _id: userId },
		{ $inc: { tokenVersion: 1 } }
	);

	return true;
};
