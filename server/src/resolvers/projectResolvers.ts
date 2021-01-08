import {
	Resolver,
	Query,
	Mutation,
	UseMiddleware,
	Arg,
	Ctx,
} from "type-graphql";
import { Project, ProjectModel } from "../models/project";
import {UserModel} from '../models/user'

import { isAuth } from "../middleware/isAuth";

import { createProjectInput } from "../typeDefs/inputTypes";
import { ProjectResponse } from "../typeDefs/responseTypes";
import { MyContext } from "../typeDefs/MyContext";

@Resolver()
export class ProjectResolver {
	//CREATE PROJECT
	@Mutation(() => Project)
	@UseMiddleware(isAuth)
	async createProject(
		@Arg("projectData")
		{ title, description, projectTags, dueDate }: createProjectInput,
		@Ctx() ctx: MyContext
	): Promise<ProjectResponse> {
		let project;

        //TODO INTEGRATE AUTO-POPULATE PLUGIN
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
                {"_id":ctx.payload?.userId},
                {"$push": {"projects": project._id}}
                )
		} catch (err) {
			return {
				errors: [
					{
						field: "project",
						message: "Something went wrong",
					},
				],
			};
		}

		return project;
	}
}
