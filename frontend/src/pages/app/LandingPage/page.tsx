"use client";
import { Button } from "../../../components/ui/button";
import { ChevronRight } from "lucide-react"
import { useAuth } from "../../../context/AuthContext";
import {  useNavigate } from "react-router";
 
 

export const Heading = () => {

    const { user } = useAuth();
    const navigate = useNavigate();

    return(
        <div className="max-w-3xl dark:text-white space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents, & Plans. Unified Welcome to
                <span className="underline"> Lotion</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Lotion is the connected workspace where <br/>
                better, faster work happens. 
            </h3>
            <Button className="bg-black text-white" onClick={() => navigate(user ? "/documents" : "/login")}>
                Enter Lotion
                <ChevronRight className="h-4 w-4 ml-2"/>
            </Button>
        </div>
    )
}; 