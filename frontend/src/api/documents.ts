import axios from './axios'

export interface Document {
  _id: string
  icon?: string; 
  title: string
  content?: any
  isArchived: boolean
  createdAt: string
  updatedAt: string
  coverImage?: string; 
  parentDocument?: string

  parentDocumentTitle?: string; 
}


export interface NewDocument {
     title: string; 
     content?: any;
     parentDocument?: string

     
    }

export const getDocument = async (id: string): Promise<Document> => {
  const { data } = await axios.get<Document>(`/api/documents/${id}`);
  return data;
};

export const fetchDocById = async (id: string): Promise<Document> => {
  const { data } = await axios.get<Document>(`/api/documents/${id}`);
  return data;
};


export const fetchDocuments = async(
  
  parentDocument?: string
): Promise<Document[]> => {
   //console.log("fetchDocuments called with parentDocument=", parentDocument);

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

export const shareDocument = (docId: string, userEmail: string, permission: 'viewer' | 'editor') =>
  axios.post(`/api/documents/${docId}/share`, { userEmail, permission });

export const updateDocument = async (vars: {
  id: string,
  title?: string,
  content?: any 
}): Promise<Document> => {
  const { data } = await axios.patch<Document>(
    `/api/documents/${vars.id}`,
    vars
  );
  return data;
}

export const setDocumentIcon = (id: string, icon: string): Promise<Document> => {
  return axios
  .patch<Document>(`/api/documents/${id}/icon`, { icon })
  .then((res) => res.data); 
}

export const removeDocumentIcon = (id: string): Promise<Document> => {
  return axios
  .delete<Document>(`/api/documents/${id}/icon`)
  .then((res) => res.data); 
}
