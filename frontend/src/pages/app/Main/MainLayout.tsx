import React from "react";
import Navigation from "./LeftSideBar/Navigation";
import { SearchCommand } from "./LeftSideBar/Search-command";
import { SearchProvider } from "../../../context/SearchContext";
import { SettingsProvider, useSettings } from "./LeftSideBar/use-settings";
import { SettingsModal } from "./LeftSideBar/SettingsModal";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <SettingsProvider>
            
            <SearchProvider>
                <div className="h-screen  flex dark:bg-[#1F1F1F]">
                    <Navigation/>
                    <main className="flex-1  h-full overflow-y-auto">
                        {children}
                    </main>
                </div>
            </SearchProvider>
            <SettingsModal/>
        </SettingsProvider>
    )
}


export default MainLayout;