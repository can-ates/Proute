import {
	Resolver,
	Query,
	Arg,
	Mutation,
	Ctx,
	UseMiddleware,
} from "type-graphql";
import { hashSync, compare } from "bcrypt";

import { isAuth } from "../middleware/isAuth";
import { User, UserModel } from "../models/user";
import { LoginResponse, UserResponse } from "../typeDefs/responseTypes";
import { registerUserInput } from "../typeDefs/inputTypes";
import { MyContext } from "../typeDefs/MyContext";
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from "../auth/token";
import { DocumentType } from "@typegoose/typegoose";

@Resolver()
export class UserResolver {
	//FETCH LOGGED IN USER
	@Query(returns => User)
	@UseMiddleware(isAuth)
	async me(@Ctx() ctx: MyContext): Promise<DocumentType<User> | null> {
		return await UserModel.findById(ctx!.payload!.userId);
	}

	//FIND USER BY EMAIL
	@Query(returns => UserResponse)
	@UseMiddleware(isAuth)
	async findUserByEmail(@Arg("email") email: string): Promise<UserResponse> {
		const user = await UserModel.findOne({ email });

		if (!user) {
			return {
				errors: [
					{
						field: "user",
						message: "The user does not exist",
					},
				],
			};
		}

		return user;
	}

	//SEND INVITATION FOR PROJECT
	@Mutation(returns => String)
	@UseMiddleware(isAuth)
	async sendProjectInvitation(
		@Arg("receiverEmail") receiverEmail: string,
		@Arg("projectName") projectName: string,
		@Arg("projectId") projectId: string,
		@Ctx() ctx: MyContext
	): Promise<String> {

		try{
			//First we fetch sender's detail
			const sender = await UserModel.findById(ctx!.payload!.userId);

			const notification = {
				senderName: sender?.name,
				senderPhoto: sender?.photoURL,
				projectName,
				projectId,
				message: `${sender?.name} has invited you to ${projectName} project`,
			};

			//Update receiver's notifications
			await UserModel.updateOne(
				{ email: receiverEmail },
				{ $push: { notifications: notification } }
			);
		} catch(err) {
			throw new Error("Something went wrong");
		}
		

		return "Invitation Sent";
	}

	//REGISTER USER
	@Mutation(returns => String)
	async registerUser(
		@Arg("userData") { name, email, password }: registerUserInput
	): Promise<String> {
		//Check if user exists
		const user = await UserModel.findOne({ email });

		if (!user) {
			const hashedPassword = hashSync(password, 10);

			UserModel.create({
				name,
				email,
				password: hashedPassword,
			});
		} else {
			throw new Error("Email already exists");
		}

		return "Register Successful";
	}

	//LOGIN USER
	@Mutation(returns => LoginResponse)
	async loginUser(
		@Arg("email") email: string,
		@Arg("password") password: string,
		@Ctx() ctx: MyContext
	): Promise<LoginResponse> {
		const user = await UserModel.findOne({ email }).select("+password");

		if (!user) {
			return {
				errors: [
					{
						field: "email",
						message: "Wrong credentials",
					},
				],
			};
		}

		const isValidPassword = await compare(password, user.password!);

		if (!isValidPassword) {
			return {
				errors: [
					{
						field: "password",
						message: "Wrong credentials",
					},
				],
			};
		}

		sendRefreshToken(ctx.res, createRefreshToken(user));

		return {
			//CLIENT WILL SEND THIS TOKEN FOR AUTHORIZED ROUTES
			accessToken: createAccessToken(user),
			user,
		};
	}
}
