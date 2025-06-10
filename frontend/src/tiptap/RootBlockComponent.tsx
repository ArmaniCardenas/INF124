// src/tiptap/RootBlockComponent.tsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { Plus, GripVertical } from 'lucide-react'

export default function RootBlockComponent({ getPos, editor }: NodeViewProps) {
  const insertBelow = () => {
    const pos = (getPos() as number) + editor.state.selection.$from.parent.nodeSize
    editor.chain().focus().insertContentAt(pos, {
      type: 'rootblock',
      content: [{ type: 'paragraph' }],
    }).run()
  }

  return (
    // wrapper flush under the title; no extra padding here
    <NodeViewWrapper className="group relative flex">
      {/* pull it 1.5rem left of the text */}
      <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 flex space-x-1
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={insertBelow} className="p-1 hover:bg-gray-200 rounded">
          <Plus className="w-5 h-5 text-gray-500" />
        </button>
        <button draggable data-drag-handle className="p-1 cursor-grab hover:bg-gray-200 rounded">
          <GripVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      {/* text itself stays flush with the page content */}
      <NodeViewContent className="w-full" />
    </NodeViewWrapper>
  )
}
