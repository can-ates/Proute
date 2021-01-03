import { Resolver, Query } from "type-graphql";
import Project from "../typeDefs/projectTypes";
import {Project as ProjectModel} from '../models/project'


@Resolver()
export class ProjectResolver {
    

    @Query(() => Project)
    async projects(){
        return "hello world"
    }
}