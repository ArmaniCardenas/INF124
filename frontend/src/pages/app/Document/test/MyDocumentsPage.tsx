import { useEffect, useState } from 'react';
// import { createDocument, getAllDocuments } from '../../../api/document';
import { Link } from 'react-router-dom';
import { fetchAllDocuments } from '../../../../api/documents';
import { Document } from '../../../../api/documents';

export const MyDocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  // const [title, setTitle] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    fetchAllDocuments().then(setDocuments);
  }, []);

  // const handleCreate = async () => {
  //   const doc = await createDocument();
  //   console.log("Here is the created doc: ", doc);
  //   navigate(`${doc.data._id}`);
  // };

  console.log('all docs: ', documents);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      {/* <div className="mb-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New doc title" className="border p-2 mr-2" />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
      </div> */}
      <ul>
        {documents.map(doc => (
          <li key={doc._id} className="mb-2">
            <Link to={`${doc._id}`} className="text-blue-600 underline">{doc.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};