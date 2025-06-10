// frontend/src/pages/app/Document/Editor.tsx
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import React, { useEffect, useCallback } from 'react'
import { getExtensions } from '../../../../tiptap/getExtension'
import { debounce }        from 'lodash'

interface EditorProps {
  docId: string
  initialContent: JSONContent
  readOnly?: boolean
  onUpdate: (json: JSONContent) => void
  openLinkModal: () => void
}

export const Editor: React.FC<EditorProps> = ({
  docId,
  initialContent,
  readOnly = false,
  onUpdate,
  openLinkModal,
}) => {
  // debounce your save calls
  const debounced = useCallback(
    debounce((json: JSONContent) => onUpdate(json), 300),
    [onUpdate]
  )

  const editor = useEditor({
    editable: !readOnly,
    extensions: getExtensions({ openLinkModal }),
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'ProseMirror main-editor',
      },
    },
    onUpdate: ({ editor }) => {
      debounced(editor.getJSON() as JSONContent)
    },
  },
  [docId],
)

  // listen for Mod-K globally and open your modal
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent, false)
    }
  }, [editor, initialContent])

  return <EditorContent editor={editor} />
}
