"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TicketTemplates } from "@/components/tickets/ticket-templates"
import { useRealtimeStore } from "@/lib/realtime-store"

// Mock ticket templates
const mockTemplates = [
  {
    id: 1,
    name: "Password Reset Request",
    description: "Template for users who need to reset their password",
    subject_template: "Password Reset Request for {{user_email}}",
    body_template: `I am unable to access my account and need to reset my password.

Account Details:
- Email: {{user_email}}
- Last successful login: {{last_login}}
- Issue occurred: {{issue_date}}

Additional Information:
{{additional_details}}

Please help me regain access to my account as soon as possible.`,
    category_id: 2,
    priority: "medium",
    tags: ["password", "reset", "account", "access"],
    is_featured: true,
    usage_count: 45,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    name: "Software Bug Report",
    description: "Template for reporting software bugs and issues",
    subject_template: "Bug Report: {{bug_summary}}",
    body_template: `I have encountered a bug in the software that needs to be addressed.

Bug Details:
- Summary: {{bug_summary}}
- Steps to reproduce: {{reproduction_steps}}
- Expected behavior: {{expected_behavior}}
- Actual behavior: {{actual_behavior}}
- Browser/Device: {{browser_device}}
- Operating System: {{operating_system}}

Screenshots/Attachments:
{{attachments}}

This issue is affecting my ability to {{impact_description}}.`,
    category_id: 5,
    priority: "high",
    tags: ["bug", "software", "issue", "technical"],
    is_featured: true,
    usage_count: 32,
    created_at: new Date(Date.now() - 86400000 * 21).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 3,
    name: "Feature Request",
    description: "Template for requesting new features or enhancements",
    subject_template: "Feature Request: {{feature_name}}",
    body_template: `I would like to request a new feature or enhancement to improve the system.

Feature Details:
- Feature Name: {{feature_name}}
- Description: {{feature_description}}
- Use Case: {{use_case}}
- Expected Benefits: {{expected_benefits}}
- Priority: {{user_priority}}

Additional Context:
{{additional_context}}

This feature would help me/us to {{improvement_description}}.`,
    category_id: 4,
    priority: "low",
    tags: ["feature", "request", "enhancement", "improvement"],
    is_featured: false,
    usage_count: 18,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 4,
    name: "Billing Inquiry",
    description: "Template for billing-related questions and issues",
    subject_template: "Billing Inquiry: {{inquiry_type}}",
    body_template: `I have a question/concern regarding my billing.

Billing Details:
- Account Number: {{account_number}}
- Inquiry Type: {{inquiry_type}}
- Billing Period: {{billing_period}}
- Amount in Question: {{amount}}

Description of Issue:
{{issue_description}}

Supporting Documentation:
{{supporting_docs}}

Please review my account and provide clarification on this matter.`,
    category_id: 3,
    priority: "medium",
    tags: ["billing", "payment", "invoice", "account"],
    is_featured: true,
    usage_count: 27,
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
]

export default function TicketTemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const { currentUser, categories, setCurrentUser, users } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    // Set a default agent user if no user is logged in (for demo purposes)
    if (!currentUser) {
      const defaultAgent = users.find(user => user.role === "agent")
      if (defaultAgent) {
        setCurrentUser(defaultAgent)
      }
    }
  }, [currentUser, setCurrentUser, users])

  useEffect(() => {
    // Only agents and admins can manage templates
    if (currentUser && !["agent", "admin"].includes(currentUser.role)) {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Setting up your session</p>
        </div>
      </div>
    )
  }

  if (!["agent", "admin"].includes(currentUser.role)) {
    return null
  }

  const handleCreateTemplate = (templateData: any) => {
    const newTemplate = {
      id: Math.max(...templates.map((t) => t.id)) + 1,
      ...templateData,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTemplates([...templates, newTemplate])
  }

  const handleUpdateTemplate = (id: number, templateData: any) => {
    setTemplates(
      templates.map((template) =>
        template.id === id ? { ...template, ...templateData, updated_at: new Date().toISOString() } : template,
      ),
    )
  }

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((template) => template.id !== id))
  }

  const handleUseTemplate = (template: any) => {
    // Increment usage count
    setTemplates(templates.map((t) => (t.id === template.id ? { ...t, usage_count: t.usage_count + 1 } : t)))

    // Navigate to new ticket page with template data
    router.push(`/tickets/new?template=${template.id}`)
  }

  return (
    <TicketTemplates
      templates={templates}
      categories={categories}
      onCreateTemplate={handleCreateTemplate}
      onUpdateTemplate={handleUpdateTemplate}
      onDeleteTemplate={handleDeleteTemplate}
      onUseTemplate={handleUseTemplate}
    />
  )
}
