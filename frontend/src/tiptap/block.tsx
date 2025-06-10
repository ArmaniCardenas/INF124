import { Node, mergeAttributes, CommandProps } from '@tiptap/core'
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  NodeViewProps,
} from '@tiptap/react'
import { PlusCircle, GripVertical, Plus } from 'lucide-react'

// 1a) Tell Tiptap about your custom command:
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dBlock: {
      setDBlock: () => ReturnType
    }
  }
}

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

  // 1b) Now your setDBlock command is properly typed:
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

  addNodeView() {
    return ReactNodeViewRenderer(DBlockView)
  },
})

// 1c) Export your view so getExtensions can import it:
export function DBlockView({ node, getPos, editor }: NodeViewProps) {
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
        <Plus className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </div>

      <div
        data-drag-handle
        className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 cursor-grab"
      >
       
          <GripVertical  className="w-3 h-3 text-gray-400" />
       
      </div>

      <NodeViewContent className="ml-14 w-full" />
    </NodeViewWrapper>
  )
}
