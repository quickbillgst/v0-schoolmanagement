import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Zap, Users, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "About - School Equipment Lending Portal",
  description: "Learn about our mission to streamline school equipment management.",
  openGraph: {
    title: "About School Equipment Portal",
    description: "Our mission and values",
  },
}

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering schools with efficient equipment management solutions since day one.
        </p>
      </div>

      {/* Mission Section */}
      <div className="space-y-12 mb-20">
        <div className="bg-primary/5 rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe that managing school equipment shouldn't be complicated. Our mission is to provide a simple,
            secure, and intuitive platform that helps educational institutions streamline equipment borrowing, tracking,
            and returns. By reducing administrative burden, we enable schools to focus on what matters most: education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-secondary/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Our Values</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Reliability:</strong> Dependable service you can count on
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Efficiency:</strong> Streamlined processes that save time
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Accessibility:</strong> Easy to use for everyone
                </span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Innovation:</strong> Constantly improving our platform
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-accent/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Borrowing Rules</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>- Equipment can be borrowed for up to 7 days</li>
              <li>- Renewal available if no pending requests</li>
              <li>- Late returns result in small penalties</li>
              <li>- Damaged equipment reported immediately</li>
              <li>- Maximum 3 items per user simultaneously</li>
              <li>- Admin approval required for certain items</li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-16" />

      {/* Contact Info */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <a href="mailto:equipment@school.edu" className="text-primary hover:underline">
                  equipment@school.edu
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Office Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Monday - Friday, 8:00 AM - 5:00 PM</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
