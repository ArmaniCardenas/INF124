import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import RootBlockComponent from './RootBlockComponent'

// 1a) Tell TipTap about our custom command
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    rootBlock: {
      setRootBlock: (position?: number) => ReturnType
    }
  }
}

export const RootBlock = Node.create({
  name: 'rootblock',
  group: 'block',
  content: 'block ',
  defining: true,
  draggable: true,
  selectable: false,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="rootblock"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'rootblock' }), 0]
  },

  // 1b) our command to insert a rootblock
  addCommands() {
    return {
      setRootBlock:
        (position) =>
        ({ chain, state }) => {
          const from = position ?? state.selection.from
          return chain()
            .insertContentAt(from, {
              type: this.name,
              content: [{ type: 'paragraph' }],
            })
            .focus(from + 4)
            .run()
        },
    }
  },

  // 1c) render via ReactNodeView
  addNodeView() {
    return ReactNodeViewRenderer(RootBlockComponent)
  },
})
