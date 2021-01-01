import mongoose, { Schema, Document, ObjectId } from 'mongoose'


interface IProject extends Document {
    author: ObjectId;
    contributors: ObjectId[];
    title: string;
    description: string;
    tags: string[];
    status: string;
    tasks: [{
        priority: string;
        todo: string;
        assigned: ObjectId;
        createdAt: Date;
        tags: string[];
        status: string;
    }];
    comments: [{
        author: ObjectId;
        comment: string;
        createdAt: Date;
    }];
    createdAt: Date;
    dueDate: Date;

}

const projectSchema: Schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contributors: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
    }],
    status: {
        type: String,
        default: 'In progress'
    },
    tasks: [{
        priority: {
            type: String,
            default: 'Low'
        },
        todo: {
            type: String,
            required: true
        },
        assigned: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tags: [{
            type: String,
        }],
        status: {
            type: String,
            default: "In progress"
        }
    }],
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    }


})

export const Project = mongoose.model<IProject>('Project', projectSchema)