import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";

import { UserResolver } from "./resolvers/userResolvers";
import { ProjectResolver } from "./resolvers/projectResolvers";
require("dotenv").config();

const main = async () => {
	const schema = await buildSchema({
		resolvers: [UserResolver, ProjectResolver],
	});

	const server = new ApolloServer({
		schema,
		context: ({ req, res }) => ({
			req,
			res,
		}),
	});

	const app = express();
	server.applyMiddleware({ app });

	mongoose
		.connect(`${process.env.MONGO_URI}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => {
			app.listen({ port: 4000 }, () =>
				console.log(
					"DB connected, browse to http://localhost:4000" +
						server.graphqlPath
				)
			);
		});
};

main();
