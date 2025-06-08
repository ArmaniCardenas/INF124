'use client'


import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Document, updateDocument } from '../../../api/documents'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Skeleton } from '../../../components/ui/skeleton'
import { docPath } from '../../../lib/slug'

function debounce<F extends (...args: any[]) => void>(fn: F, ms = 300) {
  let handle: ReturnType<typeof setTimeout>
  return (...args: Parameters<F>) => {
    clearTimeout(handle)
    handle = setTimeout(() => fn(...args), ms)
  }
}

interface TitleProps {
  initialData: Document
}

export function Title({ initialData }: TitleProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState(initialData.title || 'Untitled')
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitle(initialData.title || 'Untitled')
  }, [initialData.title])


  const mutateTitle = useMutation({
    mutationFn: updateDocument,

    onMutate: async ({ id, title: newTitle }) => {
      await queryClient.cancelQueries({ queryKey: ['document', id] })

      const previousDoc = queryClient.getQueryData<Document>([
        'document',
        id,
      ])

      queryClient.setQueryData<Document>(['document', id], (old) =>
        old
          ? (
              { ...(old as Document), title: newTitle } as Document
            )
          : old
      )

      queryClient.setQueriesData<Document[]>(
      { queryKey: ['documents'], exact: false },
      (old) =>
        old?.map((d) =>
          d._id === id ? ({ ...(d as Document), title: newTitle } as Document) : d
        )
    )

      return { previousDoc }
    },

    onError: (_err, variables, context) => {
      if (context?.previousDoc) {
        queryClient.setQueryData(
          ['document', variables.id],
          context.previousDoc
        )
      }
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document', variables.id],
      })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const debouncedMutate = useCallback(
    debounce((newTitle: string) => {
      mutateTitle.mutate({ id: initialData._id, title: newTitle })
    }, 300),
    []
  )

  const enableInput = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, title.length)
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    debouncedMutate(newTitle)

    navigate(docPath(newTitle, initialData._id), { replace: true })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      disableInput()
    }
  }

  return (
    <div className="flex gap-x-1 items-center">
      {initialData.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
          ref={inputRef}
          className="h-7 px-2 focus-visible:ring-transparent"
          value={title}
          onChange={onChange}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
        />
      ) : (
        <Button
          className="font-normal h-auto p-1"
          variant="ghost"
          size="lg"
          onClick={enableInput}
        >
          <span className="truncate">{title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="w-20 h-8 rounded-md" />
}
