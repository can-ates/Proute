import { Field, ObjectType, ID } from "type-graphql";
import { prop, Ref, getModelForClass, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'

import {Project} from "./project";

@plugin(autopopulate as any)
@ObjectType({description: "User type definitions"})
export class User {
    //TODO TRY MINIMIZING COLUMNS
    @Field(type => ID)
    _id?: string;

    @prop({ required: true, unique: true })
    @Field()
    name?: string;

    @prop({ required: true, unique: true })
    @Field()
    email?: string;

    @prop()
    @Field()
    password?: string;

    @prop()
    @Field()
    googleId?: string;

    @prop()
    @Field()
    facebookId?: string;

    @prop()
    @Field()
    githubId?: string;

    @prop({ default: 'https://res.cloudinary.com/dqwhaxlxv/image/upload/v1609528014/18958255_qo7mxj.jpg' })
    @Field()
    photoURL?: string;

    @prop({autopopulate: true, ref: 'Project'})
    @Field(type => [Project])
    projects?: Ref<Project>[]

    @prop({default: 0})
    @Field()
    tokenVersion?: number
}

export const UserModel = getModelForClass(User)
