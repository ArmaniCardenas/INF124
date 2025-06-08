import { useState } from 'react';
import { shareDocument } from '../../../../api/documents';

export const ShareModal = ({ docId, onClose }) => {
  const [userEmail, setUser] = useState('');
  const [permission, setPermission] = useState<'viewer' | 'editor'>('viewer');

  const handleShare = async () => {
    console.log('doc id: ', docId);
        console.log('user email: ', userEmail);
            console.log('permission: ', permission);


    await shareDocument(docId, userEmail, permission);
    onClose();
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
      </div>
    </div>
  );
};