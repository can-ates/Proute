import { ObjectType, Field } from "type-graphql";
import { Project } from "../models/project";
import {User} from '../models/user'

@ObjectType()
class FieldError {
	@Field()
	field?: string;
	@Field()
	message?: string;
}

//USER
@ObjectType({description: "LOGIN USER RESPONSE"})
export class LoginResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field({ nullable: true })
	accessToken?: string;

	@Field(() => User, { nullable: true })
	user?: User;
}

//PROJECT
@ObjectType({description: "GENERAL PROJECT RESPONSE"})
export class ProjectResponse{
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
    
    @Field({nullable: true})
    project?: Project
}
