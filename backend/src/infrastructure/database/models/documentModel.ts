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
        default: 'editor'
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

         type: mongoose.Schema.Types.Mixed,
          default: { type: 'doc', content: [] } 
        },
        

    parentDocument: {
        //type: Types.ObjectId,
        type: String,
        default: ""
    },
    
    collaborators: [collaboratorSchema],
   

    isArchived: {
        type: Boolean,
        default: false
    },

    workspaceId: {
        type: String, 
        default: ""
    },

    icon: {
        type: String,
        default: ""

    },

    coverImage: {
        type: String, 
        default: ""

    },

},
{timestamps: true}

);

export default model<Document>('Document', documentSchema);