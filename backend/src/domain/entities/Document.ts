export interface Collaborator {
    userId: string; 
    role: "owner" | "editor" | "viewer";

}

export interface Document {
    _id?: string; 
    title: string; 
    content: string; 
    workspaceId: string; 
    collaborators: Collaborator[]; 
    isArchived: boolean; 
    createdAt?: Date; 
    updatedAt?: Date; 
}