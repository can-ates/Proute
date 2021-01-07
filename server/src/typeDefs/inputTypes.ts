import { InputType, Field } from "type-graphql";
import {IsNotEmpty, IsEmail, Length} from 'class-validator'



@InputType({ description: "Register User Data" })
export class registerUserInput {
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