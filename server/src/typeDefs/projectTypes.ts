import { Field, ObjectType, ID } from "type-graphql";
import User from './userTypes'

@ObjectType({description: "Task type definition"})
class Task {
    @Field({nullable: true})
    priority?: string;

    @Field({nullable: true})
    todo?: string;

    @Field(type => User, {nullable: true})
    assigned?: User;

    @Field({nullable: true})
    createdAt?: Date;

    @Field(type => String, {nullable: true})
    tags?: string[];

    @Field({nullable: true})
    status?: string;
}

@ObjectType({description: "Comment type definition"})
class Comment {
    @Field(type => User, {nullable: true})
    author?: User;

    @Field({nullable: true})
    comment?: string;

    @Field({nullable: true})
    createdAt?: Date
}




@ObjectType({description: "Project type definitions"})
export default class Project {
    @Field(type => ID, {nullable: true})
    _id?: string

    @Field(type => User,{nullable: true})
    author?: User;

    @Field(type => [User], {nullable: true})
    contributors?: User[];

    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    description?: string;

    @Field(type => String, {nullable: true})
    tags?: string[];

    @Field({nullable: true})
    status?: string;

    @Field(type => [Task], {nullable: true})
    tasks?: Task[]
    
    @Field(type => Comment, {nullable: true})
    comments?: Comment[]

    @Field({nullable: true})
    createdAt?: Date

    @Field({nullable: true})
    dueDate?: Date

}
