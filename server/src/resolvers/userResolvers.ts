import {
	Resolver,
	Query,
	Arg,
	Mutation,
	InputType,
	Field,
	Ctx,
} from "type-graphql";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import User from "../typeDefs/userTypes";
import { MyContext } from "../typeDefs/MyContext";
import { UserModel } from "../models/user";

import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

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
	//REGISTER USER
	@Mutation(returns => String)
	async registerUser(
		@Arg("userData") newUserData: registerUserInput
	): Promise<String> {
		let { name, email, password } = newUserData;

		//Search if user exists
		const user = await UserModel.findOne({ email });

		if (!user) {
			const hashedPassword = hashSync(password, 10);

			UserModel.create({
				name,
				email,
				password: hashedPassword,
            });
            
            
		}

        return user ? "Email already exists" : "Register Successful"
	}

	
}
