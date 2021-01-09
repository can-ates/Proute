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

import { createProjectInput, addTaskInput } from "../typeDefs/inputTypes";
import { ProjectResponse } from "../typeDefs/responseTypes";
import { MyContext } from "../typeDefs/MyContext";

@Resolver()
export class ProjectResolver {


	//ADD TASK TO PROJECT
	//TODO IMPLEMENT AUTHOR CHECKER MIDDLEWARE
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
}
