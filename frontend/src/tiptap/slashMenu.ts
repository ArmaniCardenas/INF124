// src/tiptap/slashMenu.ts
import { PluginKey } from 'prosemirror-state'
import { SuggestionProps } from '@tiptap/suggestion'         // still the types
import { Editor, Range } from '@tiptap/core'
import tippy, { Instance } from 'tippy.js'
import { ReactRenderer } from '@tiptap/react'
import QueryMenu from './QueryMenu'
import { SlashMenuItems, SlashMenuItem } from './suggestions'

// no more explicit type annotation here
export const slashMenu = {
  pluginKey: new PluginKey('slashMenu'),
  char: '/',
  startOfLine: true,      // allow slash at very start

  items: ({ query }: { query: string }) => {
    console.log('[slash] items() query=', JSON.stringify(query))
    const q = query.trim().toLowerCase()
    return q
      ? SlashMenuItems.filter(item =>
          item.title.toLowerCase().includes(q)
        )
      : SlashMenuItems
  },

  command: ({ editor, range, props: item }: any) => {
    item.command({ editor, range })
  },

  render: () => {
    let component: ReactRenderer | null = null
    let popup: Instance
    let clientRect: DOMRect

    return {
      onStart: (props: SuggestionProps<SlashMenuItem, SlashMenuItem>) => {
        component = new ReactRenderer(QueryMenu, {
          editor: props.editor,
          props,
        })
        clientRect = props.clientRect!()!
        popup = tippy(document.body, {
          getReferenceClientRect: () => clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        }) as Instance
      },

      onUpdate: (props: SuggestionProps<SlashMenuItem, SlashMenuItem>) => {
        if (!component) return
        component.updateProps(props)
        clientRect = props.clientRect!()!
        popup.setProps({
          getReferenceClientRect: () => clientRect,
        })
      },

      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (!component || !component.ref) return false
          return (component.ref as any).onKeyDown({ event }) ?? false
      },

      onExit: () => {
        popup.destroy()
        component?.destroy()
      },
    }
  },
}
