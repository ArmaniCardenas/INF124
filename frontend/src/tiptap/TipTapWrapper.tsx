import React, { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import { getExtensions } from './getExtension'
import CustomBubbleMenu from './CustomBubbleMenu'
import axios from '../api/axios'         
import { setPage } from './pageSlice'
import { usePageData } from './usePageData'

export function TiptapWrapper() {
  const pageInfo = useSelector((s: any) => s.page.pageInfo)
  const dispatch = useDispatch()
  const { mutate: saveContent } = usePageData.useUpdateContent()
  const [localContent, setLocalContent] = useState<any>(pageInfo.content)

  const debouncedSync = useCallback(
    debounce((content: any) => {
      if (JSON.stringify(content) !== JSON.stringify(pageInfo.content)) {
        saveContent(
          { pageId: pageInfo.id, content },
          {
            onSuccess: async () => {
              const { data } = await axios.get(`/pages/${pageInfo.id}`)
              dispatch(setPage(data))
            },
          }
        )
      }
    }, 2000),
    [pageInfo.content, pageInfo.id, saveContent, dispatch]
  )

  const editor = useEditor({
    extensions: getExtensions({ openLinkModal: () => {} }),
    editorProps: {
      attributes: { class: 'main-editor focus:outline-none' },
    },
    content: localContent,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      setLocalContent(json)
      debouncedSync(json)
    },
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(!pageInfo.pageSettings.lock)
      editor.commands.setContent(pageInfo.content)
      setLocalContent(pageInfo.content)
    }
  }, [pageInfo, editor])

  if (!editor) return null
  return (
    <>
      <CustomBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}
