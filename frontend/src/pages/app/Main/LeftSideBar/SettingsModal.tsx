'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '../../../../components/ui/dialog'
import { Label } from '../../../../components/ui/label'
import { ModeToggle } from '../../LandingPage/ModeToggle'
import { useSettings } from './use-settings'

export function SettingsModal() {
  const { isOpen, close } = useSettings()

  return (
    <Dialog  open={isOpen} onOpenChange={close} modal={false}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>
                Appearance
            </Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Lotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
