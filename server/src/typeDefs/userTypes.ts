import { Field, ObjectType, ID } from "type-graphql";
import Project from "../typeDefs/projectTypes";

@ObjectType({description: "The user type definitions"})
export default class User {
    @Field(type => ID)
    _id!: string;

    @Field()
    name?: string;

    @Field()
    password?: string;

    @Field()
    googleId?: string;

    @Field()
    facebookId?: string;

    @Field()
    githubId?: string;

    @Field()
    photoURL?: string;

    @Field(type => [Project])
    projects?: Project[];
}
