import { useState, useEffect } from 'react';
import { shareDocument, listCollaborators } from '../../../api/documents';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';


export const ShareModal = ({ docId, onClose }) => {
  const [userEmail, setUser] = useState('');
  const [permission, setPermission] = useState<'viewer' | 'editor'>('viewer');
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const result = await listCollaborators(docId);
      setCollaborators(result.data);
      console.log('collaborators: ', collaborators);
    };

    fetchCollaborators();
  }, [docId]);

  const handleShare = async () => {
    try {
      await shareDocument(docId, userEmail, permission);

      const updated = await listCollaborators(docId);
      setCollaborators(updated.data);
      setUser('');
      setPermission('viewer');
      onClose();
    } catch (error: any){
      console.log('error: ', error.response.data.message)
      if (error.response?.status === 404) {
        toast.error(`Error sharing document: ${error.response?.data?.message || ''}`);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
    
  };

  const handlePermissionChange = async (userId: string, newRole: 'viewer' | 'editor') => {
    console.log('trying to send: ', userId, " | ", newRole);
    await shareDocument(docId, userId, newRole);
    const updated = await listCollaborators(docId);
        console.log('just sent and received: ', updated);

    setCollaborators(updated.data);
  };

  const handleRemove = async (userId: string) => {
    // await removeCollaborator(docId, userId);
    // const updated = await listCollaborators(docId);
    // setCollaborators(updated);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Share Document</h2>
        <input
          placeholder="User Email"
          value={userEmail}
          onChange={(e) => setUser(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <select value={permission} onChange={(e) => setPermission(e.target.value as 'viewer' | 'editor')} className="border p-2 w-full mb-4">
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={handleShare} className="bg-blue-600 text-white px-4 py-2 rounded">Share</button>
        </div>

      {/* Existing collaborators */}
        <h3 className="font-semibold mb-2">Shared With</h3>
        <ul className="space-y-2">
          {collaborators.map(c => (
            <li key={c.email} className="flex items-center justify-between border p-2 rounded">
              <div>
                <div className="font-medium">{c.name || c.email}</div>
                <div className="text-sm text-gray-500">{c.email}</div>
              </div>

              {c.role === 'owner' ? (
                <div className="text-sm font-semibold text-gray-600">Owner</div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={c.role}
                    onChange={(e) => handlePermissionChange(c.email, e.target.value as 'viewer' | 'editor')}
                    className="border p-1"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    onClick={() => handleRemove(c.userId)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

      </div>
      <ToastContainer/>
    </div>
  );
};