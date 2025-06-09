import { Request, Response, RequestHandler, NextFunction } from 'express';
import DocumentModel from '../database/models/documentModel';
import UserModel from '../database/models/userModel'
type AsyncHandler = RequestHandler; 


export async function createDocument(req: Request, res: Response) {
  // const { userId: userId } = req.user!;
  const doc = await DocumentModel.create({
    title: req.body.title,
    parentDocument: req.body.parentDocument ?? '',
    collaborators: [{ userId: req.user, role: 'owner' }],
  });
  res.status(201).json(doc);
}

export async function listCollaborators(req: Request, res: Response) {
  try{
    // console.log(req.document.collaborators[0].userId.name);
    const userIds = req.document.collaborators.map(c => c.userId);
    const users = await UserModel.find({ _id: { $in: userIds } }).select('username email');


    const userMap = new Map();
    users.forEach(u => userMap.set(u._id.toString(), { name: u.username, email: u.email }));

    // Step 4: combine collaborator roles with user info
    const collaborators = req.document.collaborators.map(c => {
      const userInfo = userMap.get(c.userId.toString()) || {};
      return {
        userId: c.userId.toString(),
        name: userInfo.name || null,
        email: userInfo.email || null,
        role: c.role,
      };
    });

    res.status(200).json(collaborators);
  }catch{
    console.log('error listing collaborators')
    res.status(404)
  }
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
  res.json(req.document);
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

export const shareDocument = async (req: Request, res: Response) => {
  const { userEmail, permission } = req.body;
  const user = await UserModel.findOne({ email: userEmail });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const doc = req.document;
  const existing = await doc.collaborators.find(c => c.userId.toString() == user?._id.toString());

  if (existing) {
    existing.role = permission;
  } else {
    doc.collaborators.push({ userId: user._id, role: permission });
  }
  await doc.save();

  res.status(200);
};

export const listTrashDocuments: AsyncHandler = async (req, res) => {
  console.log('1');
  const userId = (req.user! as any)._id;
  console.log('userid: ', userId);

  const docs = await DocumentModel.find({
    'collaborators.userId': userId,
    isArchived: true
  }).select('_id title updatedAt parentDocument')
    console.log('docs: ', docs);

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

async function collectDescendantIds(rootId: string): Promise<string[]>
{
  const direct = await DocumentModel.find({ parentDocument: rootId }, '_id');
  const nested = await Promise.all(
    direct.map(d=> collectDescendantIds(d._id.toString()))
  );
  return [...direct.map(d=> d._id.toString()), ...nested.flat()];
}


