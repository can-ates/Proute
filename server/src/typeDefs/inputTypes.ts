import { InputType, Field } from "type-graphql";
import {IsNotEmpty, IsEmail, Length, MinDate } from 'class-validator'



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

@InputType({description: "Create Project"})
export class createProjectInput{
	@Field()
	title!: string;

	@Field()
	description!: string;

	@Field(type => [String], {nullable: true})
	projectTags?: string[];
	
	//DUE DATE SHOULD NOT BE EARLIER THAN TODAY
	@MinDate(new Date())
	@Field()
	dueDate!: Date
}
