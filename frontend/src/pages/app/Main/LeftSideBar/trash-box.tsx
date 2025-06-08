"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Input } from "../../../../components/ui/input"
import { ConfirmModal } from "./confirm";
import { Search, Trash2, RotateCcw, Undo } from "lucide-react";
import { fetchTrash, restoreDocument, deleteDocument, Document } from "../../../../api/documents";
import { toast } from "react-toastify";
import { docPath, extractId } from "../../../../lib/slug";

export const TrashBox = () => {

    const navigate = useNavigate(); 
    const queryClient = useQueryClient(); 
    const params = useParams<{ documentId?: string }>(); 
    const [filter, setFilter] = useState(''); 
    const { pathname } = useLocation()
    const lastSegment = pathname.split('/').pop() || ''
    const currentDocId = extractId(lastSegment)


    const { data: docs = [], isLoading, isError } = useQuery<Document[]>({
        queryKey: ['documents', 'trash'],
        queryFn: fetchTrash, 
    })

    const restore = useMutation({
        mutationFn: restoreDocument,
        onSuccess: (doc) => {
            toast.success('Restored')
            queryClient.invalidateQueries({ queryKey: ['documents']})

            queryClient.setQueryData(['document', doc._id], doc)
            if (params.documentId !== doc._id)
            {
                navigate(docPath(doc.title, doc._id), { replace: true })
            }
        },
        onError: () => toast.error('Restore failed')

    })


    const remove = useMutation({
        mutationFn: deleteDocument,
        onSuccess: (_msg, deletedId) => {
            queryClient.setQueryData<Document[]>(
                ['documents', 'trash'],
                (old) => old?.filter(d => d._id !== deletedId)
            )

            queryClient.invalidateQueries({ queryKey: ['documents','trash'], exact: false })
            queryClient.removeQueries( {queryKey: ['document', deletedId ]} )
            
        },
    })

    const handlePermanentDelete = (docId: string) => {
      const p = remove.mutateAsync(docId)
      toast.promise(p, {
        success: 'Deleted permanently',
        error: 'Delete failed',
      })
      p.then(() => {
        console.log('delete.then:', { docId, currentDocId })
        if (currentDocId === docId) {
          navigate('/documents', { replace: true })
        }
      })
    }

    const visible = docs.filter(d =>
        d.title.toLowerCase().includes(filter.toLowerCase())
    )

    if (isLoading) return <p className="p-4 text-center">Loading…</p>
    if (isError)   return <p className="p-4 text-center text-rose-500">Couldn’t load trash.</p>;





    return(
        <div className="text-sm dark:text-white  ">
            <div className="flex items-center gap-x-1 p-2 ">
                <Search className="h-4 w-4"/>
                <Input
                value={filter}
                onChange={e=> setFilter(e.target.value)}
                className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                placeholder="Filter by page title..."/>
            </div>  
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No documents found.
                </p>
                {visible.map(doc =>(
                    <div
                      key={doc._id}
                      className="text-sm rounded-sm w-full hover:bg-primary/5 flex justify-between items-center text-primary"
                      role="button"
                      onClick={()=>navigate(docPath(doc.title, doc._id))}  
                    >
                        <span className="truncate p1-2">
                            {doc.title}
                        </span>
                        <div className="flex items-center" onClick={e => e.stopPropagation()}>
                            <div className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 o" 
                            onClick={e=>{ e.stopPropagation(); restore.mutate(doc._id )}}>
                                <Undo className="w-4 h-4 text-muted-foreground"/>
                            </div>
                            <ConfirmModal  onConfirm={()=> handlePermanentDelete(doc._id)} >
                                <div className="rounded-sm p-2 hover:bg-neutral-200
                                dark:hover:bg-neutral-600" role="button">
                                <Trash2 className="w-4 h-4 text-muted-foreground"/>
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                    ))}
            </div>
        </div>
    );
};

