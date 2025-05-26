import { Request, Response, NextFunction } from 'express';
import Document from '../database/models/documentModel';

export const authorizeDocAccess = (permissions: 'viewer' | 'editor' | 'owner') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Document.findById(req.params.id);
    const userId = req.user._id;

    if (!doc){
        res.status(404).json({message: 'Document not found'});
          console.log("did not find doc from doc access middleware");

        return;
    }
    // const isOwner = doc.ownerId.toString() === userId;
    // console.log("user id", userId);
    //     console.log("doc user id", doc.collaborators[1].userId);

    const collaborator = doc.collaborators.find(c => c.userId.toString() === userId.toString());
    console.log('role:', collaborator?.role)
    const hasViewAccess = collaborator;
    const hasEditAccess = (collaborator?.role === "editor" || collaborator?.role === "owner");
    const isOwner = collaborator?.role === "owner";

    if (
      (permissions === 'viewer' && hasViewAccess) ||
      (permissions === 'editor' && hasEditAccess) ||
      (permissions === 'owner' && isOwner)
    ) {
    // console.log("passing doc on from doc access middleware");
    // console.log("permissions required: ", permissions);
    // console.log("has view access: ", hasViewAccess);
    // console.log("has edit access: ", hasEditAccess);
    // console.log("is owner: ", isOwner);




      req.document = doc; // Pass document to controller
      return next();
    }
      res.status(403).send('Forbidden');
  }
};
