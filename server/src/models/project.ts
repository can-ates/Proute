import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

import { UserModel } from './user';


class CommentModel {
    @prop({ref: () => UserModel, required: true })
    public author!: Ref<UserModel>;

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

    @prop({ref: () => UserModel, required: true})
    public assigned!: Ref<UserModel>

    @prop({default: Date.now})
    public createdAt?: Date

    @prop()
    public tags?: string[]

    @prop({ default: 'In progress'})
    public status?: string
}

export class ProjectModel {
    @prop({ref: () => UserModel, required: true })
    public author!: Ref<UserModel>;

    @prop({ref: () => UserModel })
    public contributors?: Ref<UserModel>[];

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

export const Project = getModelForClass(ProjectModel)
