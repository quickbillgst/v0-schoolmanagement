import type { Metadata } from "next"

export const publicMetadata: Metadata = {
  title: "School Equipment Lending Portal",
  description: "Manage equipment borrowing efficiently",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://equipment.school.edu",
    images: [
      {
        url: "/placeholder.svg",
        width: 1200,
        height: 630,
        alt: "School Equipment Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School Equipment Lending Portal",
    description: "Manage equipment borrowing efficiently",
  },
}
