import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "../../../../components/ui/popover";
import {DocumentList} from "./DocumentList";
import { Item } from "./Item";

import { cn } from "../../../../lib/utils";
import Navbar from "../../LandingPage/Navbar";
import { UserItem } from "./user-items";
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createDocument, fetchDocuments, NewDocument, Document } from "../../../../api/documents";
import { useAuth } from "../../../../context/AuthContext";


export default function Navigation() {



  const { user } = useAuth();

  const navigate = useNavigate();
  const params = useParams<{ documentId?: string }>();
  const queryClient = useQueryClient(); 

  const { data: documents = [], isLoading, isError } = useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: () => fetchDocuments(),
  });


  console.log({ documents, isLoading, isError });

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



  const isMobile = useMediaQuery("(max-width: 768px)");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile)
    {
        collapse();
    }
       
    else
    {
        resetWidth();
    } 
  }, [isMobile]);

  useEffect(() => {
    if (isMobile)
    {
        collapse();
    } 
  }, [params.documentId, isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let w = e.clientX;
    w = Math.max(240, Math.min(480, w));
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${w}px`;
      navbarRef.current.style.left = `${w}px`;
      navbarRef.current.style.width = `calc(100% - ${w}px)`;
    }
  };
  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };


  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {

    
        setIsCollapsed(false);
        setIsResetting(true);

        sidebarRef.current.style.width = isMobile ? "100%" : "240px";
        navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px")
        navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");

        setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
        setIsCollapsed(true);
        setIsResetting(true);

        sidebarRef.current.style.width = "0";
        navbarRef.current.style.left = "0";
        navbarRef.current.style.width = "100%";

        setTimeout(() => setIsResetting(false), 300);
    }
  };



  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary relative flex flex-col z-[99999] bg-neutral-100 overflow-y-auto overflow-x-hidden",
          isResetting && "transition-all ease-in-out duration-300",
          isCollapsed && "w-0",
          !isCollapsed && "w-60"
        )}
      >
        <div
          className={cn(
            "w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2",
            isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100",
            "transition"
          )}
          onClick={collapse}
        >
          <ChevronsLeft className="w-6 h-6" />
        </div>
        <div>
          <UserItem/>
          <Item label="Search" icon={Search} isSearch onClick={() => {}}/>
          <Item label="Settings" icon={Settings} onClick={()=> {}}/>
          <Item
          
            onClick={handleCreate}
            label="New Page"
            icon={PlusCircle}
          />

        </div>

        
        <div className="mt-4">
          <DocumentList/>
          <Item onClick={handleCreate}
          icon={Plus}
          label="Add a page"/>
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash}></Item>
            </PopoverTrigger>
            <PopoverContent
            className="p-0 w-72"
            side={isMobile ? 'bottom' :  'right'}>
              trash

            </PopoverContent>
          </Popover>
            
        </div>

        <div
          className={cn(
            "group-hover/sidebar:opacity-100 opacity-0 cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0",
            isResetting && "transition-all ease-in-out duration-300"
          )}
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] bg-background dark:bg-[#1F1F1F] flex items-center px-3 py-2",
          isResetting && "transition-all ease-in-out duration-300",
          isCollapsed ? "left-0 w-full" : "left-60 w-[calc(100%-240px)]"
        )}
      >
        {!!params.documentId ? (
          <Navbar   />
        ) : (
          <nav className="w-full flex justify-between">
            {isCollapsed && (
              <MenuIcon className="w-6 h-6 text-muted-foreground" onClick={resetWidth} />
            )}
            
          </nav>
        )}
      </div>
    </>
  );
}
