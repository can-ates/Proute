import { Response } from "express";
import { sign } from "jsonwebtoken";

import {User} from '../typeDefs/userTypes'

export const createAccessToken = (user: User) => {
  console.log(process.env.ACCESS_TOKEN_SECRET)
  return sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m"
  });
};

export const createRefreshToken = (user: User) => {
  console.log(process.env.REFRESH_TOKEN_SECRET)
  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d"
    }
  );
};


export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token"
  });
};