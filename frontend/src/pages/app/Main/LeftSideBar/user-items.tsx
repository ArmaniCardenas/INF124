
import React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
 } from "../../../../components/ui/dropdown-menu"
import { ChevronsLeftRight  } from "lucide-react"
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";

import { Button } from "../../../../components/ui/button"
import { useAuth } from "../../../../context/AuthContext";

import { useNavigate } from "react-router";

export const UserItem = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
                <div role="button" className="flex  items-center text-sm p-3 w-full  hover:bg-neutral-200 ">
                    <div className="gap-x-2  flex items-center max-w-[150px] ">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src="reading.png" />
                        </Avatar>
                        <span className="text-start  font-medium line-clamp-1">
                                {user?.username}&apos;s Notion
                        </span>
                    </div>
                    <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />

                </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-80 p-2 bg-white dark:bg-neutral-800 text-black dark:text-white "
                align="start"
                alignOffset={11}
                forceMount
            >

                <p className="text-xs dark:text-white font-medium leading-none text-muted-foreground text-black">
                    {user?.email}
                </p>

                <div className="flex items-center gap-x-2 mt-2">

                    <div className="rounded-full bg-secondary p-1">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/reading.png" />
                        </Avatar>
                    </div>
                    <p className="text-sm line-clamp-1 font-medium">
                        {user?.username}&apos;s Notion    
                    </p>
                </div>

            
                <DropdownMenuSeparator className="my-2"/>
                    <DropdownMenuItem asChild className="cursor-pointer text-muted-foreground">
                        <Button onClick={async ()=> {
                            await logout();
                            navigate("/")
                        
                        }}
                        variant="ghost" className="w-full justify-center  hover:bg-neutral-200 "
                        >
                            Logout
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}



