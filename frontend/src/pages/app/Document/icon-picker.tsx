'use client'	

import EmojiPicker, {Theme as EmojiTheme} from 'emoji-picker-react'

import { useTheme } from '../LandingPage/ThemeProvider'

import {Popover,PopoverContent,PopoverTrigger} from '../../../components/ui/popover'


interface IconPickerProps {
  onChange:(icon:string) => void
  children:React.ReactNode
  asChild?:boolean
}

export function IconPicker ({onChange,children,asChild}:IconPickerProps) {

  const { theme: rawTheme} = useTheme()

  let current: 'light' | 'dark'; 

  if (rawTheme == 'system')
  {
    current = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } else {
    current = rawTheme; 
  }


  const emojiTheme = current === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT;


return (
    <Popover>
      <PopoverTrigger asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker height={350}  theme={emojiTheme}
        onEmojiClick={data => onChange(data.emoji)}/>
      </PopoverContent>
    </Popover>
  )
}