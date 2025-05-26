import axios from './axios'

export interface Document {
  _id: string
  icon: string; 
  title: string
  content?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  parentDocument?: string
}


export interface NewDocument {
     title: string; 
     content?: string;
     parentDocument?: string

     
    }

export const fetchDocuments = async(
  
  parentDocument?: string
): Promise<Document[]> => {
   console.log("fetchDocuments called with parentDocument=", parentDocument);

  const q = parentDocument ? `?parentDocument=${parentDocument}` : ""
  const { data } = await axios.get<Document[]>(`/api/documents${q}`)
  return data; 
}

export const createDocument = async (payload: NewDocument): Promise<Document> => {
    const { data } = await axios.post<Document>('/api/documents', payload);
    return data; 
}

export const archiveDocument = async (id: string) => {
  const { data } = await axios.patch<{message:string}>(`/api/documents/${id}/archive`, {})
  return data
}

export const fetchTrash = () => axios.get<Document[]>('/api/documents/trash').then(r=>r.data)



export const restoreDocument = (id: string) => axios.patch<Document>(`/api/documents/${id}/restore`).then(r => r.data);


export const deleteDocument  = (id: string) => axios.delete<{message:string}>(`/api/documents/${id}`).then(r => r.data);

export const fetchAllDocuments = async (): Promise<Document[]> => {
  const {data} = await axios.get<Document[]>('/api/documents');
  return data.filter(d => !d.isArchived); 
}