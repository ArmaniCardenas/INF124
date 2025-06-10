import { useParams }   from 'react-router-dom'
import { useMutation, useQuery }    from '@tanstack/react-query'
import { fetchDocById, Document, updateDocument } from '../../../api/documents'
import { extractId } from '../../../lib/slug'
import { cn } from '../../../lib/utils'
import { Editor } from './test/Editor'
import { PageBody } from './PageBody'



import { Toolbar } from './toolbar'

export default function DocumentPage() {
   const { slugAndId = '' } = useParams<'slugAndId'>();
  const id = extractId(slugAndId);




  const { data, isLoading, isError } = useQuery<Document>( {
    queryKey: ['document', id],
    queryFn : () => fetchDocById(id),
    
    enabled : !!id,
  })
  



    const update = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
    },
  })

    const onChange = (content: string) => {
      update.mutate({ id, content })
  }


  const handleUpdate = (content: any) => {
    update.mutate({ id: id, content });
  };

  if (isLoading) return <div className="p-4">Loading…</div>

  if (isError)        return <p className="p-4">Document not found.</p>
  if (!data)          return null 
  

  return (
    <>

      <div className={cn(
+        "pb-40",
         data.isArchived ? "pt-32 md:pt-36" : "pt-24 md:pt-28" )}
         >
        <div className='mx-auto px-6 md:px-24 max-w-3xl lg:max-w-4xl'>
          <Toolbar initialData={data}/>
          <PageBody initialData={data}></PageBody>
          

        </div>
       
      </div>
    </>
  )
}
