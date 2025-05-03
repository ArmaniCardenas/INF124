import React from "react";
import { cn } from "../../../lib/utils";
import { Logo } from "./logo";

import useScrollTap from "./useScrollTop";
import useScrollTop from "./useScrollTop";
import { ModeToggle } from "./ModeToggle";

export default function Navbar () {

    const scrolled = useScrollTop();
    

    return (
        <div className={cn("z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center transition-border w-full p-6",
            scrolled && "border-b shadow-sm" 
        )}>
        <Logo/>
        <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap=x=2">
            <ModeToggle/> 

        </div>

        </div>
    )
}