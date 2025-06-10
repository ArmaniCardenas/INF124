import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTheme } from '../pages/app/LandingPage/ThemeProvider'

export interface CommandItem {
  title: string
  img: string
  desc: string
  command: (item: CommandItem) => void
}

interface CommandListProps {
  items: CommandItem[]
  command: (item: CommandItem) => void
}

export const CommandList = React.forwardRef(
  ({ items, command }: CommandListProps, ref) => {
    const { theme } = useTheme()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
          return true
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % items.length)
          return true
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          command(items[selectedIndex])
          return true
        }
        return false
      },
    }))

    useEffect(() => {
      const container = scrollRef.current
      const child = container?.children[selectedIndex + 1] as HTMLElement
      if (child && container) {
        const { top, bottom } = child.getBoundingClientRect()
        const { top: cTop, bottom: cBottom } = container.getBoundingClientRect()
        if (bottom > cBottom) container.scrollTop += bottom - cBottom
        if (top < cTop)    container.scrollTop -= cTop - top
      }
    }, [selectedIndex])

    const bg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
    const selectedBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
    const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

    return (
      <div
        ref={scrollRef}
        className={`${bg} shadow-lg rounded p-2 space-y-1 overflow-y-auto max-h-96 w-64`}>
        <div className={`text-sm font-semibold pl-2 ${textSecondary}`}>Basic blocks</div>
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.title}
              className={`flex items-center p-2 rounded cursor-pointer ${hoverBg} ${idx === selectedIndex ? selectedBg : ''}`} 
              onMouseEnter={() => setSelectedIndex(idx)}
              onClick={() => command(item)}>
              {item.img && (
              <img src={item.img!} alt={item.title} className="w-8 h-8 rounded border" />
              )}              <div className="ml-2 flex-1">
                <div className={`text-sm font-medium ${textPrimary}`}>{item.title}</div>
                <div className={`text-xs ${textSecondary}`}>{item.desc}</div>
              </div>
            </div>
          ))
        ) : (   
          <div className={`p-2 text-center ${textSecondary}`}>No results</div>
        )}
      </div>
    )
  }
)

CommandList.displayName = 'CommandList'
