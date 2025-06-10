// src/tiptap/getExtension.ts
import StarterKit from '@tiptap/starter-kit'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import { DraggableListItem } from './DraggableListItem'


import { SlashMenuExtension } from './SlashMenuExtension'

import type { AnyExtension } from '@tiptap/core'
import { Extension, Node } from '@tiptap/core'
import { slashMenu } from './slashMenu'
import { RootBlock } from './RootBlock'
import { Keymap } from './keyMap'

const Document = Node.create({
  name: 'doc',
  topNode: true,
  content: 'rootblock+',
})



export function getExtensions({
  openLinkModal,
}: {
  openLinkModal: () => void
}): AnyExtension[] {
  return [
    Document,
    Keymap,


  
    StarterKit.configure({
      document: false,
      heading: { levels: [1, 2, 3] },
    }),

    SlashMenuExtension, 

    //DraggableListItem,

    RootBlock,





    Dropcursor.configure({ width: 2, class: 'notion-dropcursor' }),
    Gapcursor,
    HardBreak,
    Link.configure({ autolink: true, linkOnPaste: true, openOnClick: true }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'doc') return 'Untitled'
        if (node.type.name === 'paragraph') return 'Type “/” for commands'
        return ''
      },
    }),
    TextStyle,
    Color.configure({ types: ['textStyle'] }),
    Highlight.configure({ multicolor: true }),
    Mention.configure({ /* mention config here */ }),
    // use the factory form, not `.configure`:




     
  ] as unknown as AnyExtension[]
}
