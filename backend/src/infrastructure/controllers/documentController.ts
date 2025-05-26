import { Request, Response } from 'express';
import DocumentModel from '../database/models/documentModel';
import UserModel from '../database/models/userModel';

export async function createDocument(req: Request, res: Response) {
  // const { userId: userId } = req.user!;
  const doc = await DocumentModel.create({
    title: req.body.title,
    collaborators: [{ userId: req.user, role: 'owner' }],
  });
  res.status(201).json(doc);
}

export async function listDocuments(req: Request, res: Response) {
  const q = req.query.search as string | undefined;
  const docs = await DocumentModel.find({
    'collaborators.userId': req.user!._id,
    isArchived: false,
    ...(q && { title: { $regex: q, $options: 'i' } })
  }).select('title updatedAt');
  res.json(docs);
}

export async function getDocument(req: Request, res: Response) {
  res.json(req.document);
}

export async function updateDocument(req: Request, res: Response) {
  const { title, content } = req.body;
  const doc = await DocumentModel.findOneAndUpdate(
    { _id: req.params.id, 'collaborators.userId': req.user!._id },
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
    { _id: req.params.id, 'collaborators.userId': req.user!._id },
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

export const shareDocument = async (req: Request, res: Response) => {
  const { userEmail, permission } = req.body;
  const user = await UserModel.findOne({ email: userEmail });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const doc = req.document;
  const existing = await doc.collaborators.find(c => c.userId.toString() == user?._id.toString());

  // console.log('param email': userEmail);
  // console.log('doc email:', doc.collaborators[0].userId)
  if (existing) {
    existing.permission = permission;
  } else {
    
    doc.collaborators.push({ userId: user._id, role: permission });
  }
  await doc.save();
  res.status(200).json({ message: 'Document shared successfully', doc });
};
