import { Request, Response } from 'express';
import DocumentModel from '../database/models/documentModel';

export async function createDocument(req: Request, res: Response) {
  console.log('▶︎ req.user is:', req.user);
  const userId = (req.user! as any)._id.toString();
  const doc = await DocumentModel.create({
    title: req.body.title,
    content: req.body.content,
    parentDocument: req.body.parentDocument ?? '',
    
    collaborators: [{ userId, role: 'owner' }],
  });
  res.status(201).json(doc);
}

export async function listDocuments(req: Request, res: Response) {
  const userId = (req.user! as any)._id;
  const parent = req.query.parentDocument as string | undefined;

  const filter: any = {
    'collaborators.userId': userId,
    isArchived: false,
  };

  if (parent !== undefined) {
    filter.parentDocument = parent;
  } else {
    filter.$or = [
      { parentDocument: { $exists: false } },
      { parentDocument: '' },
      { parentDocument: null },
    ];
  }

  const docs = await DocumentModel.find(filter)
    .select('_id title updatedAt parentDocument');

  res.json(docs);
}

export async function getDocument(req: Request, res: Response) {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc)
    {
        res.sendStatus(404!);
        return; 
    } 

  if (!doc.collaborators.some(c => c.userId.toString() === req.user!.id))
  {
    res.sendStatus(403);
    return; 

  }
    
  res.json(doc);
}

export async function updateDocument(req: Request, res: Response) {
  const { title, content } = req.body;
  const doc = await DocumentModel.findOneAndUpdate(
    { _id: req.params.id, 'collaborators.userId': req.user!.id },
    { title, content },
    { new: true }
  );
  if (!doc)
    {
       res.sendStatus(404);
        return;
    } 
  res.json(doc);
}

export async function archiveDocument(req: Request, res: Response) {
  const doc = await DocumentModel.findOneAndUpdate(
    { _id: req.params.id, 'collaborators.userId': req.user!.id },
    { isArchived: true },
    { new: true }
  );
  if (!doc)
    {
        res.sendStatus(404);
         return;
    } 
    
  res.json({ message: 'Archived' });
}
