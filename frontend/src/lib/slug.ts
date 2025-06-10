export const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')          
    .replace(/[^a-z0-9\-]/g, '')  


export const docPath = (title: string, id: string) =>
  `/documents/${encodeURIComponent(`${title || 'untitled'}`)}-${id}`


export const extractId = (slugAndId = '') =>
  slugAndId.split('-').pop() ?? ''
