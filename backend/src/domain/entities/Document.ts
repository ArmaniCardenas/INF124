import { Types } from "mongoose";

export interface Collaborator {
    userId: string; 
    role: "owner" | "editor" | "viewer";

}

export interface Document {
    _id: string; 
    title: string; 
<<<<<<< Updated upstream
    content: string; 
=======
    content?: Object; 
>>>>>>> Stashed changes
    parentDocument: string; //Types.ObjectId
    workspaceId: string; 
    collaborators: Collaborator[]; 
    isArchived: boolean; 
    createdAt?: Date; 
    updatedAt?: Date; 
<<<<<<< Updated upstream
}
=======
    icon: String; 
    isPublished: boolean; 
    coverImage?: string; 
}
>>>>>>> Stashed changes
