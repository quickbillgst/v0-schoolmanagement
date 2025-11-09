"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, HelpCircle, Menu, X } from "lucide-react"

export function PublicHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span>📚</span> School Equipment Portal
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition">
            Home
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition">
            About
          </Link>
          <Link href="/faq" className="text-foreground hover:text-primary transition">
            FAQ
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition">
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/faq#help"
            className="hidden md:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}

          <Link href="/login" className="hidden md:inline-block">
            <Button variant="outline">Sign In</Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col gap-2 p-4">
            <Link href="/" className="text-foreground hover:text-primary transition py-2">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition py-2">
              About
            </Link>
            <Link href="/faq" className="text-foreground hover:text-primary transition py-2">
              FAQ
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition py-2">
              Contact
            </Link>
            <Link href="/login" className="pt-2">
              <Button className="w-full">Sign In</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
