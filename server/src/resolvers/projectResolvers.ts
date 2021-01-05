import { Resolver, Query } from "type-graphql";
import {Project} from "../typeDefs/projectTypes";



@Resolver()
export class ProjectResolver {
    

    @Query(() => Project)
    async projects(){
        return "hello world"
    }
}