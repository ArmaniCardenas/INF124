'use client'

import { MenuIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useQuery }  from '@tanstack/react-query'

import { Document,fetchDocById } from '../../../api/documents'

import { Title } from './Title'
import { extractId } from '../../../lib/slug'
import { Banner } from './Banner'
import { Menu } from './Menu'


interface Props {
  isCollapsed: boolean
  onResetWidth: () => void
}

export function Navbar({ isCollapsed, onResetWidth }: Props) {
  const { slugAndId = '' } = useParams<'slugAndId'>()
  const id = extractId(slugAndId);

  const {
    data: documentData,
    isLoading,
    isError,
  } = useQuery<Document>({
    queryKey: ['document', id],
    queryFn: () => fetchDocById(id),
    enabled: !!id,
  })


  if (isLoading) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex justify-between gap-x-4">
        <Title.Skeleton />
        <div className="flex gap-x-2 items-center"></div>
      </nav>
    )
  }

    if (isLoading || isError || !documentData) {
    return null
  }
    



  return (
    <>
    <nav className="bg-background dark:text-white dark:bg-[#1F1F1F] px-3 py-2 w-full">
      <div className="flex items-center justify-between w-full gap-x-4">
        <div className="flex items-center gap-x-4">
          {isCollapsed && (
            <MenuIcon
              className="w-6 h-6 text-muted-foreground"
              role="button"
              onClick={onResetWidth}
            />
          )}
          <Title initialData={documentData} />
        </div>
        <div className="flex items-center gap-x-2">
          <Menu documentId={documentData._id} initialData={documentData} />
        </div>
      </div>

      {documentData.isArchived && (
        <div className="">
          <Banner documentId={documentData._id} />
        </div>
      )}
    </nav>
   
      
    </>
    
    
   
  )
}
