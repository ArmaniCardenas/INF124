import React from "react";
import Navigation from "./LeftSideBar/Navigation";
import { SearchCommand } from "./LeftSideBar/Search-command";
import { SearchProvider } from "../../../context/SearchContext";
import { SettingsProvider, useSettings } from "./LeftSideBar/use-settings";
import { SettingsModal } from "./LeftSideBar/SettingsModal";

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function MainLayout() {
    return (
        <SettingsProvider>
            
            <SearchProvider>
                <div className="h-screen  flex dark:bg-[#1F1F1F]">
                    <ToastContainer 
                        position="top-right"
                        autoClose={1500}
                        hideProgressBar
                        closeOnClick
                        pauseOnHover={false}
                        draggable={false}
                    />
                    <Navigation/>
                    <main className="flex-1  h-full overflow-y-auto">
                        <Outlet/>
                    </main>
                </div>
            </SearchProvider>
            <SettingsModal/>
        </SettingsProvider>
    )
}



