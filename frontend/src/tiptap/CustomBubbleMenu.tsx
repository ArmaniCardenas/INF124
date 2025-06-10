import { BubbleMenu, Editor } from '@tiptap/react';
import React, { useContext, useMemo } from 'react';

import { ThemeProvider, ThemeContexts } from '../pages/app/LandingPage/ThemeProvider';

const buttons = [
  { icon: 'B', action: (e: Editor) => e.chain().focus().toggleBold().run() },
  { icon: 'I', action: (e: Editor) => e.chain().focus().toggleItalic().run() },
  { icon: 'U', action: (e: Editor) => e.chain().focus().toggleUnderline().run() },
  { icon: 'S', action: (e: Editor) => e.chain().focus().toggleStrike().run() },
];

export default function CustomBubbleMenu({ editor }: { editor: Editor }) {
  const { theme } = useContext(ThemeContexts);
  const rendered = useMemo(() =>
    buttons.map((b, i) => (
      <button
        key={i}
        onClick={() => b.action(editor)}
        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {b.icon}
      </button>
    ))
  , [editor]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: 'top' }}
      className={`bg-white dark:bg-gray-800 rounded shadow flex space-x-1 ${theme === 'dark' ? 'text-white' : ''}`}
    >
      {rendered}
    </BubbleMenu>
  );
}
