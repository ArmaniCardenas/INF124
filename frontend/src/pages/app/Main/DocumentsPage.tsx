
'use client'

import React from 'react';
import { Button } from '../../../components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from "../../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDocuments, createDocument, Document, NewDocument } from '../../../api/documents';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'






export default function DocumentsPage() {

  const queryClient = useQueryClient(); 
  const { user } = useAuth()



  const createPage = useMutation({
    mutationFn: (payload: NewDocument) => createDocument(payload),
    onSuccess: (doc) => {
      toast.success(`New note created!`)
      queryClient.invalidateQueries({queryKey: ['documents']})
    },
    onError: () => {
      toast.error("Couldn't create page")
    },
  })

  const handleCreate = () => 
  {
    createPage.mutate({ title: 'Untitled', content: ''});
  }



  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <img src='/empty.png' height="300" width="300" alt='empty' 
      className='dark:hidden'>
      </img>

      <img src='/empty-dark.png' height="300" width="300" alt='empty' 
      className='hidden dark:block'>
      </img>

      <h2 className='text-lg font-medium'>
        Welcome to {user?.username}&apos;s Lotion
      </h2>
      <Button className='bg-black text-white' onClick={handleCreate}>
        <PlusCircle className='text-white h-4 w-4 mr-2'/>
        Create a Note
      </Button>
      <ToastContainer position='bottom-center' autoClose={1000} hideProgressBar={true}/>
      
    </div>
  );
}
