// src/components/QueryMenu.tsx
import React from 'react'
import type { SuggestionProps } from '@tiptap/suggestion'
import { CommandList, CommandItem } from '../tiptap/CommandList'
import type { SlashMenuItem } from '../tiptap/suggestions'

export default function QueryMenu(props: SuggestionProps<SlashMenuItem, SlashMenuItem>) {
  // Map TipTap's SlashMenuItem into our CommandItem shape
  const commandItems: CommandItem[] = props.items.map((sItem) => ({
    title: sItem.title,
    img: sItem.img ?? '',
    desc: sItem.desc ?? '',
    command: (_item) => props.command(sItem),
  }))

  // When a CommandItem is invoked, call its command callback
  const handleCommand = (item: CommandItem) => {
    item.command(item)
  }

  return <CommandList items={commandItems} command={handleCommand} />
}
