'use client'

import React from "react"
import { 
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
 } from "../../../../components/ui/alert-dialog"

 interface Props {
    children: React.ReactNode
    onConfirm: () => void; 
 }



 export function ConfirmModal({ children, onConfirm} : Props) {
    const handle = (e: React.MouseEvent) => {
       e.stopPropagation();
       onConfirm()
      }

    return (
        <AlertDialog >
            <AlertDialogTrigger onClick={e => e.stopPropagation()} asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={e => e.stopPropagation()} className="bg-white dark:bg-neutral-800 text-black dark:text-white rounded-lg">
                <AlertDialogHeader onClick={e => e.stopPropagation()}>
                    <AlertDialogTitle >
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This cannot be undone. 
                    </AlertDialogDescription>
                </AlertDialogHeader >
                <AlertDialogFooter onClick={e => e.stopPropagation()} >
                    <AlertDialogCancel onClick={e => e.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handle} >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
 }