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

//LOGIN USER
@ObjectType()
export class LoginResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field({ nullable: true })
	accessToken?: string;

	@Field(() => User, { nullable: true })
	user?: User;
}

//CREATE PROJECT
@ObjectType()
export class ProjectResponse{
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
    
    @Field({nullable: true})
    project?: Project
}
