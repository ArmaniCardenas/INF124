import { Types, model } from "mongoose";
import mongoose from "mongoose";
import { Document } from "../../../domain/entities/Document";

const collaboratorSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true, 
        },
    
    role: {
        type: String,
        enum: ['owner', 'editor', 'viewer'], 
        default: 'edtior'
        }

    },

    {_id: false}
);

const documentSchema = new mongoose.Schema<Document>({
    title: {
        type: String,
        required: true, 
    },

    content: {
        type: String,
        default: ""
    },

    workspaceId: {
        type: String, 
        default: ""
    },

    collaborators: [collaboratorSchema],

    isArchived: {
        type: Boolean,
        default: false
    },
},
{timestamps: true}

);

export default model<Document>('Document', documentSchema);