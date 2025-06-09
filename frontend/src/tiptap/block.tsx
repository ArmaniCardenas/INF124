import { Node, mergeAttributes } from '@tiptap/core'
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  NodeViewProps,
} from '@tiptap/react'
import { PlusCircle, GripVertical } from 'lucide-react'

export const DBlock = Node.create({
  name: 'dBlock',
  group: 'block',
  content: 'block+',
  draggable: true,
  selectable: false,

  parseHTML: () => [{ tag: 'div[data-d-block]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-d-block': '' }),
    0,
  ],

  addCommands() {
    return {
      setDBlock:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              content: [{ type: 'paragraph' }],
            })
            .focus()
            .run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setDBlock(),

      Enter: ({ editor }) => {
        const { state } = editor
        const { $head, from } = state.selection
        const parent = $head.node($head.depth - 1)

        if (parent.type.name !== this.name) {
          return false
        }

        let endPos = -1
        state.doc.descendants((node, pos) => {
          if (node.type.name === this.name && pos > from) {
            endPos = pos
            return false
          }
          return
        })

        if (endPos < 0) return false

        const slice = state.doc.slice(from, endPos).content.toJSON().content
        return editor
          .chain()
          .deleteRange({ from, to: endPos })
          .insertContentAt(from, {
            type: this.name,
            content: slice,
          })
          .focus(from + 2)
          .run()
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(DBlockView)
  },
})

function DBlockView({ node, getPos, editor }: NodeViewProps) {
  const insertBelow = () => {
    const pos = (getPos() as number) + node.nodeSize
    editor
      .chain()
      .insertContentAt(pos, { type: 'dBlock', content: [{ type: 'paragraph' }] })
      .focus(pos + 2)
      .run()
  }

  return (
    <NodeViewWrapper className="group relative flex">
      <div
        onClick={insertBelow}
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-pointer p-1"
      >
        <PlusCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </div>

      <div
        data-drag-handle
        className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 cursor-grab"
      >
        {[...Array(6)].map((_, i) => (
          <GripVertical key={i} className="w-3 h-3 text-gray-400" />
        ))}
      </div>

      <NodeViewContent className="ml-14 w-full" />
    </NodeViewWrapper>
  )
}
