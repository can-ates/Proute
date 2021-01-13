import {
	Resolver,
	Query,
	Mutation,
	UseMiddleware,
	Arg,
	Ctx,
} from "type-graphql";
import { Project, ProjectModel } from "../models/project";
import { UserModel } from "../models/user";

import { isAuth } from "../middleware/isAuth";
import {isAuthor} from '../middleware/isAuthor'

import { createProjectInput, addTaskInput } from "../typeDefs/inputTypes";
import { ProjectResponse } from "../typeDefs/responseTypes";
import { MyContext } from "../typeDefs/MyContext";
import { forEachField } from "apollo-server-express";
import { DocumentType } from "@typegoose/typegoose";

@Resolver()
export class ProjectResolver {

	//JOIN A PROJECT
	@Mutation(returns => Boolean)
	@UseMiddleware(isAuth)
	async joinProject(
		@Arg('projectId') projectId: string,
		@Ctx() ctx: MyContext
	): Promise<Boolean | never>{

		//First, user is added to Project's contributors
		try {
			await ProjectModel.updateOne(
				{_id: projectId},
				{$push: {contributors: ctx.payload?.userId}}
			)
			//Then added user is updated
			await UserModel.updateOne(
				{ _id: ctx.payload?.userId },
				{ $push: { projects: projectId } }
			);
		} catch (err){
			throw new Error('Something went wrong')
		}

		return true
	}

	//CREATE PROJECT
	@Mutation(returns => Project)
	@UseMiddleware(isAuth)
	async createProject(
		@Arg("projectData")
		{ title, description, projectTags, dueDate }: createProjectInput,
		@Ctx() ctx: MyContext
	): Promise<ProjectResponse> {
		let project;

		try {
			//Create a new project
			project = await ProjectModel.create({
				author: ctx.payload?.userId,
				title,
				description,
				dueDate,
				projectTags,
			});
			//Save project to current user's PROJECTS
			await UserModel.updateOne(
				{ _id: ctx.payload?.userId },
				{ $push: { projects: project._id } }
			);
		} catch (err) {
			return {
				errors: [
					{
						field: "Project",
						message: "Something went wrong",
					},
				],
			};
		}

		return project;
	}



	//DELETE PROJECT
	@Mutation(returns => String)
	@UseMiddleware(isAuth, isAuthor)
	async deleteProject(
		@Arg("projectId") projectId: string,
		@Ctx() ctx: MyContext
	): Promise<String>{

		let deletedProject: DocumentType<Project> | any= ctx.projectDetail

		//First off, Remove project from contributer's projects
		deletedProject.contributors?.forEach(async (user: any) => {
			await UserModel.findByIdAndUpdate(user!._id, {$pull: {projects: projectId}})
		})

		//Then, delete project from author's field
		await UserModel.findByIdAndUpdate(deletedProject.author!._id, {$pull: {projects: projectId}})

		//Lastly, DELETE project
		await ProjectModel.findByIdAndDelete(deletedProject._id)

		return `${deletedProject.title} successfully deleted`
	}


	//ADD TASK TO PROJECT
	//TODO WHO SHOULD CREATE TASK!!!!
	@Mutation(returns => String)
	@UseMiddleware(isAuth)
	async addTask(
		@Arg("taskData")
		{ projectId, priority, todo, assigned, taskTags, taskStatus }: addTaskInput,
		@Ctx() ctx: MyContext
	): Promise<ProjectResponse | String> {
		const newTask = { priority, todo, assigned, taskTags, taskStatus };

		try {
			await ProjectModel.updateOne(
				{_id: projectId},
				{$push: {tasks: newTask}}
			)
		} catch (err) {
			return {
				errors: [
					{
						field: "Task",
						message: "Something went wrong",
					},
				],
			};
		}
		

		return "Task added successfully";
	}

	
}
