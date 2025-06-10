// src/tiptap/DraggableListItem.ts
import ListItem from '@tiptap/extension-list-item'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ListItemComponent from './ListItemComponent'




export const DraggableListItem = ListItem.extend({
  name: 'listItem',  // override the built-in
  addNodeView() {
    return ReactNodeViewRenderer(ListItemComponent)
  },
})
