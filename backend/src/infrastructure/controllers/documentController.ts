import { Request, Response } from 'express';
import DocumentModel from '../database/models/documentModel';

export async function createDocument(req: Request, res: Response) {
  const { id: userId } = req.user!;
  const doc = await DocumentModel.create({
    title: req.body.title,
    content: req.body.content,
    collaborators: [{ userId, role: 'owner' }],
  });
  res.status(201).json(doc);
}

export async function listDocuments(req: Request, res: Response) {
  const q = req.query.search as string | undefined;
  const docs = await DocumentModel.find({
    'collaborators.userId': req.user!.id,
    isArchived: false,
    ...(q && { title: { $regex: q, $options: 'i' } })
  }).select('title updatedAt');
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
