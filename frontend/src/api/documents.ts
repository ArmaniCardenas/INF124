import axios from './axios'

export interface Document {
  _id: string
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