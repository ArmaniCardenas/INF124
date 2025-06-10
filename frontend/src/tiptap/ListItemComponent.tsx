// src/tiptap/ListItemComponent.tsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { GripVertical } from 'lucide-react'




export default function ListItemComponent({ getPos, editor }: NodeViewProps) {
  return (
    <NodeViewWrapper className="group relative">
      <div
        className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
        data-drag-handle
        draggable
      >
        <GripVertical className="w-5 h-5 text-gray-500" />
      </div>
      <NodeViewContent className="ml-6 w-full list-item-content" />
    </NodeViewWrapper>
  )
}
