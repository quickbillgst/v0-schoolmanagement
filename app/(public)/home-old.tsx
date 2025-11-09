import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground">School Equipment Lending Portal</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Manage school equipment efficiently. Borrow, track, and return items with ease.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-card rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Students & Staff</h3>
            <p className="text-muted-foreground">Browse available equipment and submit borrowing requests easily</p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Admins</h3>
            <p className="text-muted-foreground">Manage equipment inventory and approve borrowing requests</p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Return Tracking</h3>
            <p className="text-muted-foreground">Monitor all borrowings and track equipment returns</p>
          </div>
        </div>
      </div>
    </main>
  )
}
