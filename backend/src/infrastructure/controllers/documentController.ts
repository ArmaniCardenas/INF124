import { Request, RequestHandler, Response, NextFunction } from 'express';
import DocumentModel from '../database/models/documentModel';


type AsyncHandler = RequestHandler; 


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


export const listTrashDocuments: AsyncHandler = async (req, res) => {
  const userId = (req.user! as any)._id;

  const docs = await DocumentModel.find({
    'collaborators.userId': userId,
    isArchived: true
  }).select('_id title updatedAt parentDocument')
  res.json(docs)

}

export const restoreDocument: AsyncHandler = async (req, res) => {
  const root = await DocumentModel.findOneAndUpdate(
    { _id: req.params.id, 'collaborators.userId': req.user!._id },
    { isArchived: false },
    { new: true }
  );
  if (!root) 
    {
      res.sendStatus(404);
      return; 
    }


  const kids = await collectDescendantIds(root._id.toString());
  if (kids.length) await DocumentModel.updateMany(
    { _id: { $in: kids } }, { isArchived: true }
  );

  res.json(root)
}

export const deleteDocument: AsyncHandler = async (req, res) => 
{
  const ids = [req.params.id, ...(await collectDescendantIds(req.params.id))];
  await DocumentModel.deleteMany({
    _id: { $in : ids},
    'collaborators.userId': req.user!._id
  })


  res.json({ message: 'Deleted Permanately' })

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
  const root = await DocumentModel.findOneAndUpdate(
    { _id: req.params.id, 'collaborators.userId': req.user!._id },
    { isArchived: true },
    { new: true }
  );

  if (!root)
    {
        res.sendStatus(404);
        return; 
        
    } 
  const kids = await collectDescendantIds(root._id.toString());
  if (kids.length) await DocumentModel.updateMany(
    { _id: { $in: kids } }, { isArchived: true }
  );
    
  res.json({ message: 'Archived' });
}

async function collectDescendantIds(rootId: string): Promise<string[]>
{
  const direct = await DocumentModel.find({ parentDocument: rootId }, '_id');
  const nested = await Promise.all(
    direct.map(d=> collectDescendantIds(d._id.toString()))
  );
  return [...direct.map(d=> d._id.toString()), ...nested.flat()];
}

