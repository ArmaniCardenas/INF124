// src/tiptap/keyMap.ts
import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Keymap: {
      handleEnterKey: () => ReturnType
    }
  }
}

export const Keymap = Extension.create({
  name: 'Keymap',

  addCommands() {
    return {
      handleEnterKey:
        () =>
        ({ chain, state }) => {
          const { $from, $to } = state.selection
          const parent     = $from.parent
          const grand      = $from.node($from.depth - 1)
          const rootEndPos = $from.after($from.depth - 1)

          // ——— 1) Continue non-empty lists ———
          if (parent.type.name === 'listItem' && $to.pos === $from.pos) {
            if (parent.content.size > 0) {
              return chain().splitListItem('listItem').run()
            }
            // ——— 2) Empty listItem → new rootblock ———
            return chain()
              .insertContentAt(rootEndPos, {
                type: 'rootblock',
                content: [{ type: 'paragraph' }],
              })
              .focus(rootEndPos + 1)
              .run()
          }

          // ——— 3) Empty blockquote → new rootblock ———
          if (
            grand.type.name === 'blockquote' &&
            parent.type.name === 'paragraph' &&
            $to.pos === $from.pos &&
            parent.content.size === 0
          ) {
            return chain()
              .insertContentAt(rootEndPos, {
                type: 'rootblock',
                content: [{ type: 'paragraph' }],
              })
              .focus(rootEndPos + 1)
              .run()
          }

          // ——— 4) Otherwise, if in a rootblock, split it as before ———
          if (grand.type.name === 'rootblock' && $to.pos === $from.pos) {
        return chain()
          .splitBlock()       // split the paragraph out
          .setRootBlock()     // then wrap the new paragraph in its own rootblock
          .run()
      }

          // ——— 5) fallback ———
          return false
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => editor.commands.handleEnterKey(),
    }
  },
})
