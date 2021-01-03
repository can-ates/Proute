import { Field, ObjectType, ID } from "type-graphql";
import User from './userTypes'

@ObjectType({description: "Task type definition"})
class Task {
    @Field()
    priority?: string;

    @Field()
    todo?: string;

    @Field(type => User)
    assigned?: User;

    @Field()
    createdAt?: Date;

    @Field(type => String)
    tags?: string[];

    @Field()
    status?: string;
}

@ObjectType({description: "Comment type definition"})
class Comment {
    @Field(type => User)
    author?: User;

    @Field()
    comment?: string;

    @Field()
    createdAt?: Date
}




@ObjectType({description: "Project type definitions"})
export default class Project {
    @Field(type => ID)
    _id!: string

    @Field(type => User)
    author?: User;

    @Field(type => [User])
    contributors?: User[];

    @Field()
    title?: string;

    @Field()
    description?: string;

    @Field(type => String)
    tags?: string[];

    @Field()
    status?: string;

    @Field(type => [Task])
    tasks?: Task[]
    
    @Field(type => Comment)
    comments?: Comment[]

    @Field()
    createdAt?: Date

    @Field()
    dueDate?: Date

}
