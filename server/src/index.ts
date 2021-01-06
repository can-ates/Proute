import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import cors from 'cors'

import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { UserModel } from "./typeDefs/userTypes";
import { UserResolver } from "./resolvers/userResolvers";
import { ProjectResolver } from "./resolvers/projectResolvers";
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from "./auth/token";

const main = async () => {
	const app = express();
	app.use(
		cors({
		  origin: "http://localhost:3000",
		  credentials: true
		})
	  );
	app.use(cookieParser());
	//For every graphql request, Client will 
	//check if the token expired, if expired
	//Token will be refreshed before request
	app.post("/refresh_token", async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: "" });
		}

		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
		} catch (err) {
			
			return res.send({ ok: false, accessToken: "" });
		}

		// token is valid and
		// we can send back an access token
		const user = await UserModel.findOne({ id: payload.userId });

		if (!user) {
			return res.send({ ok: false, accessToken: "" });
		}

		
		if (user.tokenVersion !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: "" });
		}

		sendRefreshToken(res, createRefreshToken(user));

		return res.send({ ok: true, accessToken: createAccessToken(user) });
	});

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

	//Apollo offers cors but we want to implement it ourself
	server.applyMiddleware({ app, cors: false });

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
