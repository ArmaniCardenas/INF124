'use client'


import { useNavigate } from "react-router-dom"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"



import { Button } from "../../../components/ui/button"

import { ConfirmModal } from "../Main/LeftSideBar/confirm"
import { deleteDocument, restoreDocument } from "../../../api/documents"


interface BannerProps {
  documentId: string; 
}

export function Banner ({documentId}:BannerProps) {

  const navigate = useNavigate()
  const queryClient = useQueryClient(); 

  const remove = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
  })


  const restore = useMutation({
    mutationFn: (id: string) => restoreDocument(id),
    onSuccess: (doc) => {
      queryClient.setQueryData(['document', doc._id], doc)
      queryClient.invalidateQueries({queryKey: ['documents']})

    },
  })

  const onRemove = () => {
    const promise = remove.mutateAsync(documentId)

    toast.promise(promise,{
      success:'Note deleted!',
      error:'Failed to delete note.'
    })

    void promise.then(() => {
        navigate(`/documents`, {replace: true})
    })
  }

  const onRestore = () => {
    const promise = restore.mutateAsync(documentId)

    toast.promise(promise,{
      success:'Note restored!',
      error:'Failed to restore note.'
    })
  }

return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex gap-x-2 justify-center items-center">
      <p>This page is in the Trash.</p>
      <Button className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2
      h-auto font-normal" variant='outline' size='sm' onClick={onRestore}>
        Restore page
      </Button>
       <ConfirmModal onConfirm={onRemove}>
        <Button className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2
      h-auto font-normal" variant='outline' size='sm'>
        Delete forever
      </Button>
       </ConfirmModal>
    </div>
  )
}