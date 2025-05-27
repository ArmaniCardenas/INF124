"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "../../../../components/ui/input"
import { ConfirmModal } from "./confirm";
import { Search, Trash2, RotateCcw, Undo } from "lucide-react";
import { fetchTrash, restoreDocument, deleteDocument, Document } from "../../../../api/documents";
import { toast } from "react-toastify";

export const TrashBox = () => {

    const navigate = useNavigate(); 
    const queryClient = useQueryClient(); 
    const params = useParams<{ documentId?: string }>(); 
    const [filter, setFilter] = useState(''); 



    const { data: docs = [], isLoading, isError } = useQuery<Document[]>({
        queryKey: ['documents', 'trash'],
        queryFn: fetchTrash, 
    })

    const restore = useMutation({
        mutationFn: restoreDocument,
        onSuccess: () => {
            toast.success('Restored')
            queryClient.invalidateQueries({ queryKey: ['documents']})
        },
        onError: () => toast.error('Restore failed')

    })


    const remove = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            toast.success('Deleted permanetly')
            queryClient.invalidateQueries({ queryKey:['documents'] })
            if (params.documentId) navigate('/documents', { replace: true })
            
        },
        onError: () => toast.error('Deleted failed')
    })

    const visible = docs.filter(d =>
        d.title.toLowerCase().includes(filter.toLowerCase())
    )

    if (isLoading) return <p className="p-4 text-center">Loading…</p>
    if (isError)   return <p className="p-4 text-center text-rose-500">Couldn’t load trash.</p>;





    return(
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
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
                      onClick={()=>navigate(`/documents${doc._id}`)}  
                    >
                        <span className="truncate p1-2">
                            {doc.title}
                        </span>
                        <div className="flex items-center" onClick={e => e.stopPropagation()}>
                            <div className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 o" 
                            onClick={e=>{ e.stopPropagation(); restore.mutate(doc._id )}}>
                                <Undo className="w-4 h-4 text-muted-foreground"/>
                            </div>
                            <ConfirmModal  onConfirm={() =>remove.mutate(doc._id)} >
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

