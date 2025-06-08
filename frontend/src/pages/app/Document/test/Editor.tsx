import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { socket } from '../../../api/socket';
import { debounce } from 'lodash'; 

export const Editor = ({ content, docId, editable }) => {

  // Debounced function to save content to the server
  const saveContent = debounce((docId, content) => {
    // console.log('saving on frontend');
    // console.log('content: ', content);

    socket.emit('save-document', { docId, content });
  }, 1000);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();

      // Broadcast changes to other users
      socket.emit('send-changes', { docId, delta: json });

      // Save changes to the server
      saveContent(docId, json);
    }
  });

  useEffect(() => {
    if (!editor) return;

    // Join the document room
    socket.emit('join-document', { docId });

    // Handle receiving content from other users
    const handleIncomingChanges = (delta) => {
      editor.commands.setContent(delta, false);
    };

    socket.on('receive-changes', handleIncomingChanges);

    return () => {
      socket.off('receive-changes', handleIncomingChanges);
    };
  }, [editor, docId]);

  return <EditorContent editor={editor} />;
};
