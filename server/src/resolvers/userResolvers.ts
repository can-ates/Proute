import { Resolver, Query } from "type-graphql";
import User from '../typeDefs/userTypes'


@Resolver()
export class UserResolver {
    

    @Query(() => User)
    async users(){
        return "hello world"
    }
}