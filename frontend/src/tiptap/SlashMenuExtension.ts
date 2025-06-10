// src/tiptap/SlashMenuExtension.ts
import { Extension } from '@tiptap/core'
import { Suggestion } from '@tiptap/suggestion'
import { slashMenu } from './slashMenu'

// Wrap the Suggestion utility in a real Tiptap Extension:
export const SlashMenuExtension = Extension.create({
  name: 'slashMenu',

  addProseMirrorPlugins() {
    // TipTap injects `this.editor`
    return [
      Suggestion({
        ...slashMenu,
        editor: this.editor,
      }),
    ]
  },
})
