import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

import { ProjectModel } from './project';


export class UserModel {
    @prop({ required: true })
    public name!: string;

    @prop({ required: true, unique: true })
    public email!: string;

    @prop()
    public password?: string

    @prop()
    public googleId?: string

    @prop()
    public facebookId?: string

    @prop()
    public githubId?: string

    @prop({ default: 'https://res.cloudinary.com/dqwhaxlxv/image/upload/v1609528014/18958255_qo7mxj.jpg' })
    public photoURL?: string

    @prop({ref: () => ProjectModel})
    public projects?: Ref<ProjectModel>[]
}

export const User = getModelForClass(UserModel)

