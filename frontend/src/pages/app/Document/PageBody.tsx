import React, { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { debounce } from 'lodash'
import { useMutation } from '@tanstack/react-query'

import { getExtensions } from '../../../tiptap/getExtension'
import type { Document } from '../../../api/documents'
import { updateDocument } from '../../../api/documents'
import { AxiosError } from 'axios'

interface PageBodyProps {
  initialData: Document
}

export const PageBody: React.FC<PageBodyProps> = ({ initialData }) => {
  const [content, setContent] = useState<JSONContent>(
    (initialData.content as JSONContent) || { type: 'doc', content: [] }
  )

  const mutation = useMutation<Document, AxiosError, { id: string; content: JSONContent }>({
  mutationFn: ({ id, content }) => updateDocument({ id, content }),
  onError: (err) => {
    console.error('save failed', err)
  },
  onSuccess: (doc) => {
    console.log('saved', doc)
  },
})

  const save = useCallback(
    debounce((newContent: JSONContent) => {
      mutation.mutate({ id: initialData._id, content: newContent })
    }, 300),
    [initialData._id]
  )

  const editor = useEditor({
    editable: true,
    extensions: getExtensions({ openLinkModal: () => {} }),
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON() as JSONContent
      setContent(json)
      save(json)
    },
  })

  useEffect(() => {
    if (editor) {
      const serverContent = (initialData.content as JSONContent) || { type: 'doc', content: [] }
      editor.commands.setContent(serverContent, false)
      setContent(serverContent)
    }
  }, [initialData.content, editor])

  return <EditorContent editor={editor} />
}
