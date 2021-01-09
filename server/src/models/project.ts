import { Field, ObjectType, ID } from "type-graphql";
import { prop, Ref, getModelForClass, plugin } from "@typegoose/typegoose";
import autopopulate from "mongoose-autopopulate";

import { User } from "./user";

@plugin(autopopulate as any)
@ObjectType({ description: "Task type definition" })
class Task {
	@prop({ default: "Low" })
	@Field()
	priority?: string;

	@prop({ required: true })
	@Field()
	todo?: string;

	@prop({ autopopulate: { maxDepth: 1 }, ref: "User", required: true })
	@Field(type => User)
	assigned?: Ref<User>;

	@prop({ default: Date.now })
	@Field()
	startedAt?: Date;

	@prop({ type: () => [String] })
	@Field(type => String)
	taskTags?: string[];

	@prop({ default: "In progress" })
	@Field()
	taskStatus?: string;
}

@plugin(autopopulate as any)
@ObjectType({ description: "Comment type definition" })
class Comment {
	@prop({ autopopulate: { maxDepth: 1 }, ref: "User", required: true })
	@Field(type => User)
	commenter?: Ref<User>;

	@prop({ required: true })
	@Field()
	comment?: string;

	@prop({ default: Date.now })
	@Field()
	commentedAt?: Date;
}

@plugin(autopopulate as any)
@ObjectType({ description: "Project type definitions" })
export class Project {
	@Field(type => ID)
	_id?: string;

	@prop({ autopopulate: { maxDepth: 2 }, ref: "User", required: true })
	@Field(type => User)
	author?: Ref<User>;

	@prop({ autopopulate: { maxDepth: 1 }, ref: "User" })
	@Field(type => [User])
	contributors?: Ref<User>[];

	@prop({ required: true })
	@Field()
	title?: string;

	@prop({ required: true })
	@Field()
	description?: string;

	@prop({ type: () => [String] })
	@Field(type => [String])
	projectTags?: string[];

	@prop({ default: "In progress" })
	@Field()
	projectStatus?: string;

	@prop({ type: () => [Task] })
	@Field(type => [Task])
	tasks?: Task[];

	@prop({ type: () => [Comment] })
	@Field(type => [Comment])
	comments?: Comment[];

	@prop({ default: Date.now })
	@Field()
	createdAt?: Date;

	@prop({ required: true })
	@Field()
	dueDate?: Date;
}

export const ProjectModel = getModelForClass(Project);
