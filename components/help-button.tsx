"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function HelpButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/faq#help">
            <Button
              variant="ghost"
              size="icon"
              className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Help and support"
            >
              <HelpCircle className="w-6 h-6" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Help & FAQ</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
