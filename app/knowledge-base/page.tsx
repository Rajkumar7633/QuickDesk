"use client"

import { KnowledgeBaseDashboard } from "@/components/knowledge-base/knowledge-base-dashboard"
import { useRealtimeStore } from "@/lib/realtime-store"

// Mock knowledge base articles
const mockArticles = [
  {
    id: 1,
    title: "How to Reset Your Password",
    content: "Follow these simple steps to reset your password and regain access to your account...",
    category: "Account Management",
    author: "Support Team",
    author_avatar: "/placeholder.svg?height=40&width=40",
    views: 1247,
    likes: 89,
    helpful_votes: 156,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["password", "reset", "account", "security"],
    is_featured: true,
    status: "published" as const,
  },
  {
    id: 2,
    title: "Understanding Ticket Priorities",
    content: "Learn about different ticket priority levels and when to use each one for optimal support...",
    category: "Getting Started",
    author: "John Smith",
    author_avatar: "/placeholder.svg?height=40&width=40",
    views: 892,
    likes: 67,
    helpful_votes: 134,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["priorities", "tickets", "workflow", "support"],
    is_featured: true,
    status: "published" as const,
  },
  {
    id: 3,
    title: "Mobile App Installation Guide",
    content: "Step-by-step instructions for installing the QuickDesk mobile app on iOS and Android devices...",
    category: "Mobile App",
    author: "Tech Team",
    author_avatar: "/placeholder.svg?height=40&width=40",
    views: 634,
    likes: 45,
    helpful_votes: 98,
    created_at: new Date(Date.now() - 86400000 * 21).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ["mobile", "installation", "ios", "android", "pwa"],
    is_featured: false,
    status: "published" as const,
  },
  {
    id: 4,
    title: "Advanced Search and Filtering",
    content: "Master the advanced search features to quickly find tickets, users, and information...",
    category: "Advanced Features",
    author: "Sarah Johnson",
    author_avatar: "/placeholder.svg?height=40&width=40",
    views: 423,
    likes: 32,
    helpful_votes: 67,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ["search", "filtering", "advanced", "productivity"],
    is_featured: false,
    status: "published" as const,
  },
  {
    id: 5,
    title: "Email Integration Setup",
    content: "Configure email integration to automatically create tickets from incoming emails...",
    category: "Integration",
    author: "Mike Wilson",
    author_avatar: "/placeholder.svg?height=40&width=40",
    views: 567,
    likes: 41,
    helpful_votes: 89,
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    tags: ["email", "integration", "automation", "setup"],
    is_featured: true,
    status: "published" as const,
  },
]

const categories = [
  "Getting Started",
  "Account Management",
  "Mobile App",
  "Advanced Features",
  "Integration",
  "Troubleshooting",
  "API Documentation",
]

export default function KnowledgeBasePage() {
  const { currentUser } = useRealtimeStore()

  return <KnowledgeBaseDashboard articles={mockArticles} categories={categories} currentUser={currentUser} />
}
