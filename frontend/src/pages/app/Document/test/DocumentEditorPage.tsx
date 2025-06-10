// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { Editor } from './Editor';
// import { ShareModal } from './ShareModal';
// import { getDocument } from '../../../../api/documents';

// export const DocumentEditorPage = () => {
//   const { id } = useParams();
//   const [doc, setDoc] = useState<any>(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     getDocument(id!).then(setDoc);
//   }, [id]);

//   if (!doc) return <p>Loading...</p>;

//   // const permission = doc.ownerId === 'me' || doc.collaborators.find(c => c.userId === 'me')?.permission;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold">{doc.title}</h1>
//         <button onClick={() => setShowModal(true)} className="bg-gray-300 px-4 py-2 rounded">Share</button>
//       </div>
//       <div className="border-2 border-black rounded p-2">
//         <Editor content={doc.content} docId={id} editable={true} />
//       </div>
//       {showModal && <ShareModal docId={doc._id} onClose={() => setShowModal(false)} />}

//        {/* {permission === 'edit'} /> */}
//     </div>
//   );
// };
