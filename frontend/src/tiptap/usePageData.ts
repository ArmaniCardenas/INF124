import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../api/axios'
import type { AxiosError, AxiosResponse } from 'axios'

export interface UpdatePageContentData { pageId: string; content: any }
export interface UpdatePageTitleData   { pageId: string; title: string }
export interface UpdatePageCoverData   { pageId: string; url: string; verticalPosition: number }

export const usePageData = {
  updateContent: (data: UpdatePageContentData) =>
    axios.patch(`/pages/${data.pageId}/content`, { content: data.content }),

  updateTitle: (data: UpdatePageTitleData) =>
    axios.patch(`/pages/${data.pageId}/title`, { title: data.title }),

  updateCover: (data: UpdatePageCoverData) =>
    axios.patch(`/pages/${data.pageId}/cover`, {
      url: data.url,
      verticalPosition: data.verticalPosition,
    }),

  useUpdateContent: () => {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: usePageData.updateContent,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['page'] })
      },
    })
  },

  useUpdateTitle: () => {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: usePageData.updateTitle,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['page'] })
      },
    })
  },

  useUpdateCover: () => {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: usePageData.updateCover,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['page'] })
      },
    })
  },
}
