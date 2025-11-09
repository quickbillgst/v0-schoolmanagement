import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ - School Equipment Lending Portal",
  description: "Frequently asked questions about borrowing and returning equipment.",
  openGraph: {
    title: "FAQ - School Equipment Portal",
    description: "Common questions answered",
  },
}

export default function FAQ() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' on the homepage and fill out the registration form with your school email, name, and role. Your account will be activated immediately.",
        },
        {
          q: "What are the different user roles?",
          a: "There are three roles: Students (can borrow equipment), Staff (can approve requests), and Admins (manage inventory and all operations).",
        },
        {
          q: "Do I need to verify my email?",
          a: "Yes, you'll receive a verification email after registration. Click the link to activate your account.",
        },
      ],
    },
    {
      category: "Borrowing Equipment",
      questions: [
        {
          q: "How do I borrow equipment?",
          a: "Log in, browse available equipment, and click 'Request' on the item. Fill in your needed dates and submit. Staff will review and approve.",
        },
        {
          q: "How long can I keep borrowed equipment?",
          a: "Standard borrowing period is 7 days. You can request an extension if no one else has requested the item.",
        },
        {
          q: "Can I borrow multiple items at once?",
          a: "Yes, you can borrow up to 3 items simultaneously. Contact an admin if you need more.",
        },
        {
          q: "What if my request is denied?",
          a: "Requests are usually denied due to item unavailability. Try a different date or choose an alternative item.",
        },
      ],
    },
    {
      category: "Returns & Penalties",
      questions: [
        {
          q: "How do I return equipment?",
          a: "Log in, go to 'My Borrowings', and click 'Return' on the item. Follow the prompts to complete the return process.",
        },
        {
          q: "What happens if I return equipment late?",
          a: "Late returns incur a small penalty (typically $5-10 per day). Late fees help maintain equipment accountability.",
        },
        {
          q: "What if the equipment is damaged?",
          a: "Report damage immediately through the app. Document with photos if possible. You may be charged for repairs or replacement.",
        },
        {
          q: "Can I cancel a request?",
          a: "Yes, you can cancel pending requests anytime. If approved, contact admin to cancel.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page and follow the email instructions.",
        },
        {
          q: "The site won't load properly. What should I do?",
          a: "Try clearing your browser cache or using an incognito window. If issues persist, contact support.",
        },
        {
          q: "Which browsers are supported?",
          a: "We support Chrome, Firefox, Safari, and Edge. Mobile apps are available on iOS and Android.",
        },
        {
          q: "How secure is my data?",
          a: "We use industry-standard encryption (SSL/TLS) and follow school data protection guidelines.",
        },
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Find answers to common questions about using the portal.</p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-8 mb-16">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-2xl font-bold mb-4 text-primary">{section.category}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {section.questions.map((item, idx) => (
                <AccordionItem key={idx} value={`${section.category}-${idx}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:text-primary transition text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <Card id="help" className="bg-primary/5 border-primary/20">
        <CardContent className="pt-8">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Didn't find what you're looking for? Our support team is here to help.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
