import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

import { User } from './user';


class CommentModel {
    @prop({ref: () => User, required: true })
    public author!: Ref<User>;

    @prop({ required: true})
    public comment!: string

    @prop({default: Date.now})
    public createdAt?: Date
}

class TaskModel {
    @prop({default: 'Low'})
    public priority?: string

    @prop({required: true})
    public todo!: string

    @prop({ref: () => User, required: true})
    public assigned!: Ref<User>

    @prop({default: Date.now})
    public createdAt?: Date

    @prop()
    public tags?: string[]

    @prop({ default: 'In progress'})
    public status?: string
}

export class Project {
    @prop({ref: () => User, required: true })
    public author!: Ref<User>;

    @prop({ref: () => User })
    public contributors?: Ref<User>[];

    @prop({ required: true})
    public title!: string

    @prop({ required: true})
    public description!: string

    @prop()
    public tags?: string[]

    @prop({ default: 'In progress'})
    public status?: string

    @prop()
    public tasks?: TaskModel[]

    @prop()
    public comments?: CommentModel[]

    @prop({default: Date.now})
    public createdAt?: Date

    @prop({required: true})
    public dueDate!: Date
}

export const ProjectModel = getModelForClass(Project)
