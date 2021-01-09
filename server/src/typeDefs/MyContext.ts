import { Request, Response } from 'express'
import {Project} from '../models/project'

export interface MyContext {
    req: Request
    res: Response
    payload?: { userId: string };
    projectDetail?: Project
}