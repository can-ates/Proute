import mongoose, { Schema, Document, ObjectId } from 'mongoose'


export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    facebookId?: string;
    githubId?: string;
    photoURL: string;
    projects?: ObjectId[]
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    githubId: {
        type: String
    },
    photoURL: {
        type: String,
        default: 'https://res.cloudinary.com/dqwhaxlxv/image/upload/v1609528014/18958255_qo7mxj.jpg'
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }]

})

export const User = mongoose.model<IUser>('User', userSchema)

