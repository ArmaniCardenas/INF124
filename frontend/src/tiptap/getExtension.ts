import DocumentNode from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import HardBreak from '@tiptap/extension-hard-break'

import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'

import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'

import Placeholder from '@tiptap/extension-placeholder'
import Suggestion from '@tiptap/suggestion'
import Mention from '@tiptap/extension-mention'



import { DBlock } from './block'
import { suggestion } from './suggestions'

interface GetExtensionsProps {
  openLinkModal: () => void
}

export function getExtensions({ openLinkModal }: GetExtensionsProps) {
  return [
    DocumentNode,
    DBlock,
    Text,
    Paragraph,
    Dropcursor.configure({ width: 2, class: 'notion-dropcursor' }),
    Gapcursor,
    History,
    HardBreak,

    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Link.configure({
      autolink: true,
      linkOnPaste: true,
      protocols: ['mailto'],
      openOnClick: true,
      //onModKPressed: openLinkModal,
    }),

    Heading.configure({ levels: [1, 2, 3] }),
    ListItem,
    BulletList,
    OrderedList,
    TaskList,
    TaskItem.configure({ nested: true }),

    Blockquote,
    HorizontalRule,

    Placeholder.configure({
      includeChildren: true,
      placeholder: ({ node }) => {
        if (node.type.name === 'doc' && node.childCount === 0) {
          return 'Untitled'
        }
        if (node.type.name === 'paragraph' && node.childCount === 0) {
          return 'Type “/” for commands'
        }
        return ''
      },
    }),

    Highlight.configure({ multicolor: true }),
    TextStyle,
    Color.configure({ types: ['textStyle'] }),

    Mention.configure({ suggestion }),

    
  ]
}
