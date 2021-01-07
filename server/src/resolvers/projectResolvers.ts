import { Resolver, Query } from "type-graphql";
import {Project} from "../models/project";



@Resolver()
export class ProjectResolver {
    

    @Query(() => Project)
    async projects(){
        return "hello world"
    }
}