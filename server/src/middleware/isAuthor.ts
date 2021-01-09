import { MiddlewareFn } from "type-graphql";

import { MyContext } from "../typeDefs/MyContext";
import { ProjectModel } from "../models/project";
import { DocumentType } from "@typegoose/typegoose";

export const isAuthor: MiddlewareFn<MyContext> = async (
	{ args: { projectId }, context },
	next
) => {
	// console.log(projectId, context.payload);

	let project: any

	try {
		project = await ProjectModel.findById(projectId, "author")

		if(project?.author._id != context.payload?.userId){
            throw new Error("You are forbidden to apply this action");
        }
        
        context.projectDetail = project
	} catch (err) {
        throw new Error("There is no such project exists");
    }

	return next();
};
