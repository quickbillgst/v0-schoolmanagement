import type { Metadata } from "next"

export function generatePageMetadata(title: string, description: string, path = "/"): Metadata {
  return {
    title: `${title} - School Equipment Portal`,
    description,
    openGraph: {
      title: `${title} - School Equipment Portal`,
      description,
      type: "website",
      url: `https://equipment.school.edu${path}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - School Equipment Portal`,
      description,
    },
  }
}
