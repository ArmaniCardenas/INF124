'use client'

import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { MoreHorizontal, Trash } from "lucide-react"



import {DropdownMenu,DropdownMenuTrigger,
  DropdownMenuContent,DropdownMenuItem,
  DropdownMenuSeparator} from "../../../components/ui/dropdown-menu"
import { Document } from "../../../api/documents"

import { Button } from "../../../components/ui/button"
import { Skeleton } from "../../../components/ui/skeleton"
import { useAuth } from "../../../context/AuthContext"
import { archiveDocument } from "../../../api/documents"
import { docPath } from "../../../lib/slug"
	

interface MenuProps {
  documentId: string; 
  initialData: Document; 
}

export function Menu ({documentId, initialData}:MenuProps) {

  const navigate = useNavigate();
  const {user} = useAuth(); 
  const queryClient = useQueryClient(); 

  const archive = useMutation({
    mutationFn: (id: string) => archiveDocument(id),
  })

  const onArchive = () => {
    const promise = archive.mutateAsync(documentId)

    toast.promise(promise,{
      success:"Note Moved to trash!",
      error:"Failed to archive note."
    })
    void promise.then(()=> {
        queryClient.invalidateQueries({ queryKey: ['documents'] })

        const parent =
              queryClient.getQueryData<Document>(['document', initialData.parentDocument])
              ?? queryClient
                .getQueryData<Document[]>(['documents'])     
                ?.find(d => d._id === initialData.parentDocument)

            const parentTitle = parent?.title || initialData.parentDocumentTitle || ''

        if (initialData.parentDocument) {
        navigate(docPath(parentTitle, initialData.parentDocument), { replace: true })
      } else {
        navigate('/documents', { replace: true })
      }

    })
  }


  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreHorizontal className="w-4 h-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 bg-white dark:bg-neutral-800 
text-black dark:text-white" align="end" alignOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="w-4 h-4 mr-2"/>
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className="w-10 h-10"/>
  )
}