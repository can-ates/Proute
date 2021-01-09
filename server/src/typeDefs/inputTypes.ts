import { InputType, Field, ID } from "type-graphql";
import {IsNotEmpty, IsEmail, Length, MinDate } from 'class-validator'


//USER INPUT TYPES
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

//PROJECT INPUT TYPES
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

@InputType({description: "Add Task"})
export class addTaskInput{
	@Field(type => ID)
	projectId!: string

	@Field()
	priority?: string

	@Field()
	todo!: string

	@Field(type => ID)
	assigned!: string

	@Field(type => [String], {nullable: true})
	taskTags?: string[]

	@Field()
	taskStatus?: string
}