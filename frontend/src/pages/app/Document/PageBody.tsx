// src/pages/app/Document/PageBody.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { debounce } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { getExtensions } from '../../../tiptap/getExtension'
import type { Document } from '../../../api/documents'
import { updateDocument } from '../../../api/documents'
import type { AxiosError } from 'axios'
import { socket } from '../../../api/socket'
import { ShareModal } from './ShareModal'



interface PageBodyProps {
  initialData: Document
}

function migrateNode(node: any, isRoot = false): any {
  if (!node || typeof node !== 'object') return node
  if (isRoot && node.type === 'doc') {
    return {
      ...node,
      content: node.content.flatMap((child: any) => {
        const m = migrateNode(child, false)
        return m.type === 'rootblock' ? m : { type: 'rootblock', content: [m] }
      }),
    }
  }
  const type = node.type === 'dBlock' ? 'rootblock' : node.type
  const newNode: any = { ...node, type }
  if (Array.isArray(node.content)) {
    newNode.content = node.content.map((n: any) => migrateNode(n, false))
  }
  return newNode
}

export const PageBody: React.FC<PageBodyProps> = ({ initialData }) => {
  const initialJSON =
    (initialData.content as JSONContent) || { type: 'doc', content: [] }
  const [content, setContent] = useState<JSONContent>(
    migrateNode(initialJSON, true)
  )

  const mutation = useMutation<
    Document,
    AxiosError,
    { id: string; content: JSONContent }
  >({
    mutationFn: ({ id, content }) => updateDocument({ id, content }),
    onError: err => console.error('save failed', err),
    onSuccess: doc => console.log('saved', doc),
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
      socket.emit('send-changes', { docId: initialData._id, delta: json })
      save(json)
    },
  })

  useEffect(() => {
    if (!editor) return

    socket.emit('join-document', { docId: initialData._id })
    const handleIncoming = (delta: any) => {
      editor.commands.setContent(delta, false)
    }
    socket.on('receive-changes', handleIncoming)

    const server = migrateNode(
      (initialData.content as JSONContent) || { type: 'doc', content: [] },
      true
    )
    editor.commands.setContent(server, false)
    setContent(server)

    return () => {
      socket.off('receive-changes', handleIncoming)
    }
  }, [initialData.content, editor])

  return <EditorContent editor={editor} />
}
