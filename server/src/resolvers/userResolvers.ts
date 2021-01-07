import {
	Resolver,
	Query,
	Arg,
	Mutation,
	InputType,
	Field,
	Ctx,
	ObjectType,
	UseMiddleware,
} from "type-graphql";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { hashSync, compare } from "bcrypt";

import {isAuth} from '../middleware/isAuth'
import { User, UserModel } from "../typeDefs/userTypes";
import { MyContext } from "../typeDefs/MyContext";
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from "../auth/token";
import { DocumentType } from "@typegoose/typegoose";

@ObjectType()
class FieldError {
	@Field()
	field?: string;
	@Field()
	message?: string;
}

@ObjectType()
class LoginResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field({ nullable: true })
	accessToken?: string;

	@Field(() => User, { nullable: true })
	user?: User;
}

@InputType({ description: "Register User Data" })
class registerUserInput {
	@Field()
	@IsNotEmpty()
	name!: string;

	@Field()
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@Field()
	@Length(8, 16)
	@IsNotEmpty()
	password!: string;
}

@Resolver()
export class UserResolver {
	//FETCH LOGGED IN USER
	@Query(returns => User)
	@UseMiddleware(isAuth)
	async me(
		@Ctx() ctx: MyContext
	): Promise<DocumentType<User> | null>  {
		

		return await UserModel.findById(ctx!.payload!.userId)
	}

	//REGISTER USER
	@Mutation(returns => String)
	async registerUser(
		@Arg("userData") newUserData: registerUserInput
	): Promise<String> {
		let { name, email, password } = newUserData;

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
		const user = await UserModel.findOne({ email });

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
