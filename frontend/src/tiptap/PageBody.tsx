import React, { useContext, useEffect, useRef, useState } from 'react'

import { ThemeProvider, ThemeContexts } from '../pages/app/LandingPage/ThemeProvider'
import { SidebarLogicProvider, SidebarLogicContext } from './SidebarLogicContext'
import { useSelector, useDispatch } from 'react-redux'

import { usePageData } from './usePageData'

import { debounce } from 'lodash'

import { setPage } from './pageSlice'
import { TiptapWrapper } from './TipTapWrapper'

export default function PageBody() {
  const pageInfo = useSelector((s: any) => s.page.pageInfo)
  const dispatch = useDispatch()

  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [yOffset, setYOffset] = useState(0)
  const startY = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    startY.current = e.clientY
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging && containerRef.current) {
      const dy = e.clientY - startY.current
      const maxOffset = 0
      const minOffset = containerRef.current.offsetHeight - 280
      const next = Math.max(Math.min(yOffset + dy, maxOffset), -minOffset)
      setYOffset(next)
      startY.current = e.clientY
    }
  }

  const onMouseUp = () => setDragging(false)

  return (
    <ThemeProvider>
      <SidebarLogicProvider>
        <PageBodyContent
          pageInfo={pageInfo}
          dispatch={dispatch}
          containerRef={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          yOffset={yOffset}
          dragging={dragging}
        />
      </SidebarLogicProvider>
    </ThemeProvider>
  )
}

interface PageBodyContentProps {
  pageInfo: any
  dispatch: any
  containerRef: React.RefObject<HTMLDivElement | null>;
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  yOffset: number
  dragging: boolean
}

function PageBodyContent({
  pageInfo,
  containerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  yOffset,
  dragging,
}: PageBodyContentProps) {
  const { theme } = useContext(ThemeContexts)
  const { leftOpen, rightOpen } = useContext(SidebarLogicContext)
  const dispatch = useDispatch()
  //const { mutate: updateCover } = usePageData.useUpdatePageCover()


  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-auto`}>      
      {pageInfo.coverPicture.url && (
        <div
          ref={containerRef}
          className="w-full h-72 overflow-hidden relative"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <img
            src={pageInfo.coverPicture.url}
            alt="cover"
            className="w-full absolute"
            style={{ transform: `translateY(${yOffset}px)` }}
          />
        </div>
      )}
      <div
        className="p-4 relative flex-1 transition-all"
        style={{ marginLeft: leftOpen ? 240 : 0, marginRight: rightOpen ? 240 : 0 }}
      >
        <div className="flex items-center mb-4">
          <img
            src={`https://twemoji.maxcdn.com/v/latest/72x72/${pageInfo.icon}.png`}
            alt="emoji"
            className="w-10 h-10 cursor-pointer"
          />
          <input
            type="text"
            value={pageInfo.title}
            onChange={e => {}}
            placeholder="Untitled"
            className="ml-4 text-4xl font-bold bg-transparent outline-none placeholder-gray-400"
            maxLength={36}
          />
        </div>
        <div className="prose dark:prose-dark">
          <TiptapWrapper />
        </div>
      </div>
    </div>
  )
}
