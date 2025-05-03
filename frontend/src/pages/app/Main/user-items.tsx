
import React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
 } from "../../../components/ui/dropdown-menu"
import { ChevronsLeftRight  } from "lucide-react"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Avatar } from "@radix-ui/react-avatar"
import { Button } from "../../../components/ui/button"

export const UserItem = () => {
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src="reading.png" />
                        </Avatar>
                        <span className="text-start font-medium line-clamp-1">
                            User's Notion
                        </span>
                    </div>
                    <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />

                </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent
            className="w-80 bg-white"
            align="start"
            alignOffset={11}
            forceMount
            >
                <div className="flex flex-col space-y-4 p-2">
                    <p className="text-xs font-medium leading-none text-muted-foreground text-black">
                        something@hotmail.com
                    </p>
                    <div className="flex items-center gap-x-2">
                        <div className="rounded-md bg-secondary p-1">
                            <Avatar className="h-8 w-1">
                                <AvatarImage src="" />
                            </Avatar>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm line-clamp-1">
                                user's Notion    

                            </p>

                        </div>

                    </div>

                </div>
                <DropdownMenuSeparator>
                    <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
                        <Button >
                            Logout
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuSeparator>


            </DropdownMenuContent>

        </DropdownMenu>
    )
}