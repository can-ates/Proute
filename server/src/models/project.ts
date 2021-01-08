import { Field, ObjectType, ID } from "type-graphql";
import { prop, Ref, getModelForClass, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'


import {User} from './user'

@plugin(autopopulate as any)
@ObjectType({description: "Task type definition"})
class Task {
    @prop({default: 'Low'})
    @Field({nullable: true})
    priority?: string;

    @prop({required: true})
    @Field({nullable: true})
    todo?: string;

    @prop({autopopulate: true,ref: 'User', required: true})
    @Field(type => User, {nullable: true})
    assigned?: Ref<User>;

    @prop({default: Date.now})
    @Field({nullable: true})
    startedAt?: Date;

    @prop({type: () => [String]})
    @Field(type => String, {nullable: true})
    taskTags?: string[];

    @prop({ default: 'In progress'})
    @Field({nullable: true})
    taskStatus?: string;
}

@plugin(autopopulate as any)
@ObjectType({description: "Comment type definition"})
class Comment {
    @prop({autopopulate: true,ref: 'User', required: true })
    @Field(type => User, {nullable: true})
    commenter?: Ref<User>;

    @prop({ required: true})
    @Field({nullable: true})
    comment?: string;

    @prop({default: Date.now})
    @Field({nullable: true})
    commentedAt?: Date
}



@plugin(autopopulate as any)
@ObjectType({description: "Project type definitions"})
export class Project {
    @Field(type => ID, {nullable: true})
    _id?: string

    @prop({autopopulate: true,ref: 'User', required: true })
    @Field(type => User,{nullable: true})
    author?: Ref<User>;

    @prop({autopopulate: true,ref: 'User' })
    @Field(type => [User], {nullable: true})
    contributors?: Ref<User>[];

    @prop({ required: true})
    @Field({nullable: true})
    title?: string;

    @prop({ required: true})
    @Field({nullable: true})
    description?: string;

    @prop({type: () => [String]})
    @Field(type => [String], {nullable: true})
    projectTags?: string[];

    @prop({ default: 'In progress'})
    @Field({nullable: true})
    projectStatus?: string;

    @prop({type: () => [Task]})
    @Field(type => [Task], {nullable: true})
    tasks?: Task[]
    
    @prop({type: () => [Comment]})
    @Field(type => [Comment], {nullable: true})
    comments?: Comment[]

    @prop({default: Date.now})
    @Field({nullable: true})
    createdAt?: Date

    @prop({required: true})
    @Field({nullable: true})
    dueDate?: Date

}

export const ProjectModel = getModelForClass(Project)
