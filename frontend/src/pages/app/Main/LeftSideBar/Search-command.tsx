import { File } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../../components/ui/command";
import { useAuth } from "../../../../context/AuthContext"

import { useEffect, useState } from "react";
import { fetchAllDocuments, Document } from "../../../../api/documents";
import { docPath } from "../../../../lib/slug";


interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand( {open, onOpenChange }: SearchCommandProps )
{
    const {user} = useAuth(); 
    const navigate = useNavigate(); 

    const [query, setQuery] = useState('');

    const { data: docs = [], isLoading } = useQuery<Document[], Error>({
        queryKey: ['documents', 'search'],
        queryFn: fetchAllDocuments,
    })

    const results = docs.filter((d)=>
        d.title.toLowerCase().includes(query.toLowerCase())
    );

     const onSelect = (id:string, title: string) => {
        navigate(docPath(title, id));
        onOpenChange(false); 
  }


    



  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') 
        {
            e.preventDefault();
            onOpenChange(!open)
        }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  },[open, onOpenChange])


  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); 
  }, [])

  if (!mounted) return null; 


  return (
    <CommandDialog   open={open} onOpenChange={onOpenChange}  >
      <CommandInput  className="bg-white dark:bg-neutral-800 
text-black dark:text-white" value={query} onValueChange={setQuery} placeholder={`Search ${user?.username}'s Lotion`}/>
      <CommandList className="bg-white dark:bg-neutral-800 
text-black dark:text-white">
        <CommandEmpty> {isLoading ? 'Loading' : 'No results found'}</CommandEmpty>
        <CommandGroup heading='Documents'>
          {results.map(document => (
            <CommandItem key={document._id} value={`${document._id}`}
            title={document.title} onSelect={(value)=> onSelect(value, document.title)}>
              {document.icon ? (
                <p className="mr-2 text-[18px]">
                  {document.icon}
                </p>
              ) : (
                <File className="w-4 h-4 mr-2"/>
              )}
              <span>
                {document.title}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
    )
}