import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Zap, BarChart3 } from "lucide-react"

export const metadata: Metadata = {
  title: "School Equipment Lending Portal - Manage Equipment Efficiently",
  description: "Streamline equipment borrowing and returns with our comprehensive school equipment management system.",
  openGraph: {
    title: "School Equipment Lending Portal",
    description: "Manage school equipment borrowing efficiently",
    type: "website",
  },
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              Manage School Equipment <span className="text-primary">Effortlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              A modern platform for borrowing, tracking, and returning school equipment. Simple, secure, and designed
              for students, staff, and administrators.
            </p>
            <div className="flex gap-4 justify-center flex-wrap pt-4">
              <Link href="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage school equipment effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Quick Borrowing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Submit equipment requests in seconds and track their status in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Smart Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor all equipment movements and receive notifications for overdue returns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Students, staff, and admins have tailored experiences for their needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Easy Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple return process with instant confirmation and inventory updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground text-lg">Equipment Items Managed</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground text-lg">Active Users</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground text-lg">Successful Borrowings</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-16 text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join your school and start managing equipment more efficiently today.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
