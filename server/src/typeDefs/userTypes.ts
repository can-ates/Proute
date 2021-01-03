import { Field, ObjectType, ID } from "type-graphql";
import Project from "../typeDefs/projectTypes";

@ObjectType({description: "User type definitions"})
export default class User {
    @Field(type => ID)
    _id!: string;

    @Field({nullable: true})
    name?: string;

    @Field({nullable: true})
    password?: string;

    @Field({nullable: true})
    googleId?: string;

    @Field({nullable: true})
    facebookId?: string;

    @Field({nullable: true})
    githubId?: string;

    @Field({nullable: true})
    photoURL?: string;

    @Field(type => [Project], {nullable: true})
    projects?: Project[];
}
