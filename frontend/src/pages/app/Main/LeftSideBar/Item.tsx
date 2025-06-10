'use client'


import { Skeleton } from "../../../../components/ui/skeleton"


import { cn } from "../../../../lib/utils"


import { DropdownMenu,DropdownMenuTrigger,
  DropdownMenuContent,DropdownMenuItem,
  DropdownMenuSeparator } from "../../../../components/ui/dropdown-menu"
import { useAuth } from "../../../../context/AuthContext"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate, useParams, useLocation } from "react-router-dom"


import { archiveDocument,createDocument, Document} from "../../../../api/documents"
import { docPath, extractId } from "../../../../lib/slug"
import { replace } from "lodash"



interface ItemProps {
  id?:string
  documentIcon?:string
  active?:boolean
  expanded?:boolean
  isSearch?:boolean
  level?:number
  onExpand?:() => void
  label:string
  onClick?:() => void
  icon:LucideIcon
  onCreate?: (parentId?: string) => void  
  onArchive?: (id: string) => void
  initialData?: Document; 
}

export function Item ({id,label,onClick,icon:Icon,active,documentIcon,isSearch,level=0,onExpand,expanded, onCreate, onArchive, initialData}:ItemProps) {

  const {user} = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lastSegment = pathname.split('/').pop() || ''
  const params = useParams<{ documentId?: string }>();  
  const currentDocId = extractId(lastSegment)

  const queryClient = useQueryClient(); 

  const create = useMutation({
    mutationFn: createDocument,
    onSuccess: (doc: Document) => {
      queryClient.invalidateQueries({ queryKey: ['documents'], exact: false })
      navigate(docPath(doc.title, doc._id))
      onCreate?.(doc.parentDocument);
    },
  })



  const archive = useMutation({
    mutationFn: archiveDocument,
    onSuccess: (_data, archivedId) => {

      queryClient.setQueryData<Document[]>(
        ['documents'],
        (old) => old?.filter(d => d._id !== archivedId)
      )

      queryClient.invalidateQueries({ queryKey: ['documents'], exact: false })

      
    },
  })


    const handleArchive = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!id) return
      const p = archive.mutateAsync(id)
      toast.promise(p, {
        success: 'Note moved to trash!',
        error: 'Failed to archive note',
      })

      p.then(() => {
        console.log('archive.then:', { id , currentDocId})
        if (currentDocId === id) {
          if (initialData?.parentDocument) {

            const parent =
              queryClient.getQueryData<Document>(['document', initialData.parentDocument])
              ?? queryClient
                .getQueryData<Document[]>(['documents'])     
                ?.find(d => d._id === initialData.parentDocument)

            const parentTitle = parent?.title || initialData.parentDocumentTitle || ''
            
            navigate(
              docPath(parentTitle, initialData.parentDocument),
              { replace: true }
            )
          } else {
            navigate('/documents', { replace: true })

          }
        }
      })

      
  }

  const handleCreate = (e: React.MouseEvent) => {
    e.stopPropagation()
    const p = create.mutateAsync({ title: 'Untitled', parentDocument: id })
    toast.promise(p, {
      success: 'New note created!',
      error: 'Failed to create note',
    })



    
    
  }



  const handleExpand = (event:React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    onExpand?.()
  }



  const ChevronIcon = expanded ? ChevronDown : ChevronRight

return (
    <div className={cn(`group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5
    flex items-center text-muted-foreground font-medium`,
    active && 'bg-primary/5 text-primary')}
     onClick={onClick} role="button" style={{paddingLeft:level ? `${(level * 12) + 12}px` :'12px'}}>
      {!!id && (
        <div className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" onClick={handleExpand} role="button">
          <ChevronIcon className="w-4 h-4 shrink-0 text-muted-foreground/50"/>
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) :
        <Icon className="shrink-0 w-[18px] h-[18px] mr-2 text-muted-foreground"/>
      }
      <span className="truncate">
        {label}
      </span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex gap-1 items-center h-5 select-none rounded border
        bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2 ">
          <DropdownMenu >
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
              hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 bg-white dark:bg-neutral-800 
text-black dark:text-white" align="start" side="right" forceMount onClick={e => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleArchive}>
                <Trash className="w-4 h-4 mr-2"/>
                Move to Trash
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.username}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          role="button" onClick={handleCreate}>
            <Plus className="w-4 h-4 text-muted-foreground"/>
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({level}:{level?:number}) {
  return (
    <div className="flex gap-x-2 py-[3px]" style={{paddingLeft:level ? `${(level * 12) + 25}px`: '12px'}}>
      <Skeleton className="w-4 h-4"/>
      <Skeleton className="w-4 h-[30%]"/>
    </div>
  )
}

