'use client'

import React, { ElementRef, useRef, useState } from "react"
import { Icon, ImageIcon, Smile, X } from "lucide-react"

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"

import { Document, updateDocument, setDocumentIcon, removeDocumentIcon } from "../../../api/documents"
import { Button } from "../../../components/ui/button"

import { IconPicker } from "./icon-picker"
import { update } from "lodash"
import { useNavigate } from "react-router-dom"
import { docPath } from "../../../lib/slug"
import { cn } from "../../../lib/utils"


interface ToolbarProps {
  initialData: Document;
  preview?:boolean;
}

export function Toolbar ({initialData,preview}:ToolbarProps) {
  const queryClient = useQueryClient(); 
  const navigate = useNavigate(); 

  const inputRef = useRef<ElementRef<'textarea'>>(null)
  const [isEditing,setIsEditing] = useState(false)
  const [value,setValue] = useState(initialData.title)

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; title?: string; content?: string }) =>
      updateDocument(vars),

    onMutate: async ({ id, title: newTitle }) => {
      await queryClient.cancelQueries({ queryKey: ['document', id] })
      const previous = queryClient.getQueryData<Document>(['document', id])

      queryClient.setQueryData<Document>(['document', id], (old) =>
        old ? ({...old, title: newTitle } as Document) : old
    )

    queryClient.setQueriesData<Document[]>(
      { queryKey: ['documents'] },
      (old) => old?.map((d) =>
         d._id === id ? { ...d, title: newTitle ?? d.title } : d),
    )

    return { previous }
    },

    onError: (_e, vars, ctx) =>
    {
      if (ctx?.previous)
        queryClient.setQueryData(['document', vars.id], ctx.previous)
    },

  })


  const setIconMutation = useMutation({
    mutationFn: ({ id, icon }: {id: string; icon: string }) =>
      setDocumentIcon(id, icon), 

    onSuccess: (updatedDoc) => 
    {
       queryClient.invalidateQueries({ queryKey: ['document', updatedDoc._id] })
       queryClient.invalidateQueries({ queryKey: ['documents'], exact: false });

    }
  })


  const removeIconMutation = useMutation({
    mutationFn: (id: string) => removeDocumentIcon(id),
    onSuccess: (data) =>
    {

    },
  })

  //const coverImage = useCoverImage()

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    },0)
  }

  const disableInput = () => setIsEditing(false)

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value; 
    setValue(newValue)
    void updateMutation.mutateAsync({ id: initialData._id, title: newValue || 'Untitled'} )
      navigate(docPath(newValue || 'Untitled', initialData._id), { replace: true})
  }

  const onKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      disableInput()
    }
  }

  const onIconSelect = (icon:string) => {
    void setIconMutation.mutateAsync({ id: initialData._id, icon });
  }

  const onRemoveIcon = () => {
    void removeIconMutation.mutateAsync(initialData._id);
  }

return (
    <div className="pl-[54px] md:pl-0 group relative dark:text-white">
      {!!initialData.icon && !preview && (
        <div className="flex gap-x-2 items-center group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
          </IconPicker>
          <Button className="rounded-full opacity-0 group-hover/icon:opacity-100 transition
          text-muted-foreground text-xs" variant='outline' size='icon' onClick={onRemoveIcon}>
            <X className="w-4 h-4"/>
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">
          {initialData.icon}
        </p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button className="text-muted-foreground text-xs" variant='outline' size='sm'>
              <Smile className="w-4 h-4 mr-2"/>
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button className="text-muted-foreground text-xs" variant='outline' size='sm' onClick={() => {}}>
            <ImageIcon className="w-4 h-4 mr-2"/>
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <textarea className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]
        resize-none"
         ref={inputRef} onBlur={disableInput} onKeyDown={onKeyDown} value={value}
        onChange={onInput}/>
      ) : (
        <div className={cn("pb-[18px]  text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]")} onClick={enableInput}>
          {initialData.title}
        </div>
      )}
    </div>
)
}