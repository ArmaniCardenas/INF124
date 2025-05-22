'use client'
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { Document, fetchDocuments, createDocument, NewDocument } from "../../../../api/documents"
import { useAuth } from "../../../../context/AuthContext"
import { keepPreviousData, useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { cn } from "../../../../lib/utils"
import { Item } from "./Item"
import { FileIcon } from "lucide-react"


	

interface DocumentListProps {
  parentDocumentId?: string
  level?:number
  onCreate?: (parentId? : string) => void
}

export function DocumentList({ parentDocumentId, level = 0 }: DocumentListProps) {
  const params   = useParams<{ documentId?: string }>()
  const navigate = useNavigate()
  const queryClient  = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const onExpand = (documentId:string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]:!prevExpanded[documentId]
    }))
  }

  const onRedirect = (documentId:string) => {
    navigate(`/documents/${documentId}`)
  }
  

  const { data: docs = [], isLoading } = useQuery<Document[], Error>({
    queryKey: ["documents", parentDocumentId ?? "root"],
    queryFn : () => fetchDocuments(parentDocumentId),  
    placeholderData: keepPreviousData,                  
  })

  const children = parentDocumentId
  ? docs.filter(d => d.parentDocument === parentDocumentId)
  : docs.filter(d => !d.parentDocument)  
 


  const createChild = useMutation<Document, Error, NewDocument>({  
    mutationFn: createDocument,
    onSuccess: newDoc => {
    queryClient.invalidateQueries({ queryKey: ["documents"] });

    if (newDoc.parentDocument) {
      queryClient.invalidateQueries({
        queryKey: ["documents", newDoc.parentDocument]
      });
      setExpanded(e => ({ ...e, [newDoc.parentDocument!]: true }));
    }
  },
})


  if (!docs || isLoading) {
    return (
      <>
        <Item.Skeleton level={level}/>
        {level === 0 && (
          <>
          <Item.Skeleton level={level}/>
          <Item.Skeleton level={level}/>
          </>
        )}
      </>
    )
  }



  return (
    <>
      <p className={cn(`hidden text-sm font-medium text-muted-foreground/80`,
      expanded && "last:block",
      level === 0 && 'hidden')} style={{paddingLeft:level ? `${(level * 12) + 25}px` : undefined}}>
        No pages available
      </p>
      {children.map(doc => (
        <div key={doc._id}>
          <Item id={doc._id} onClick={()=>onRedirect(doc._id)}
            label={doc.title}
            icon={FileIcon}
            level={level}
            //documentIcon={document.icon}
            active={params.documentId === doc._id}
            expanded ={expanded[doc._id]}
  
            onCreate={() => {


              createChild.mutate({
                title: 'Untitled',
                content: '',
                parentDocument: doc._id
              });
            }}
            onExpand={()=> onExpand(doc._id)}
            
          />

          {expanded[doc._id] && (
            <DocumentList parentDocumentId={doc._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}