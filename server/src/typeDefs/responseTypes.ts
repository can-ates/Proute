import { ObjectType, Field } from "type-graphql";
import {User} from '../models/user'

@ObjectType()
class FieldError {
	@Field()
	field?: string;
	@Field()
	message?: string;
}

@ObjectType()
export class LoginResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field({ nullable: true })
	accessToken?: string;

	@Field(() => User, { nullable: true })
	user?: User;
}
