import { Resolver, Query, Arg, Mutation, InputType, Field, Ctx } from "type-graphql";
import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import User from '../typeDefs/userTypes'
import { UserModel } from '../models/user'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


@InputType({ description: "Register user data" })
class registerUserInput {
    @Field()
    name!: string

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @Field()
    @Length(8, 16)
    @IsNotEmpty()
    password!: string
}


@Resolver()
export class UserResolver {


    @Mutation(returns => String)
    async registerUser(
        @Arg("userData") newUserData: registerUserInput,

    ): Promise<String> {

        let { name, email, password } = newUserData


        const hashedPassword = await bcrypt.hashSync(password, 10)

        UserModel.create({
            name,
            email,
            password: hashedPassword
        }).then((doc) => {

            const token: jwt.Secret = jwt.sign({ userId: doc._id.toHexString(), name }, process.env.JWT_SECRET!, { expiresIn: "10h" })

            console.log(token)

        }).catch((err) => {
            console.log(err)
        })

        return 'lol'
    }
}