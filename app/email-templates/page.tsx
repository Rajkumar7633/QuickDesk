"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EmailTemplates } from "@/components/email/email-templates"
import { useRealtimeStore } from "@/lib/realtime-store"

// Mock email templates
const mockTemplates = [
  {
    id: 1,
    name: "Ticket Created",
    subject: "Your ticket #{{ticket_id}} has been created",
    body: `Hello {{user_name}},

Thank you for contacting {{company_name}} support. Your ticket has been successfully created.

Ticket Details:
- Ticket ID: #{{ticket_id}}
- Subject: {{ticket_subject}}
- Priority: {{ticket_priority}}
- Category: {{category_name}}
- Created: {{created_date}}

We will review your request and respond as soon as possible. You can track the progress of your ticket by logging into your account.

If you have any urgent questions, please contact us at {{support_email}}.

Best regards,
{{company_name}} Support Team`,
    trigger: "ticket_created",
    is_active: true,
    variables: [
      "{{user_name}}",
      "{{ticket_id}}",
      "{{ticket_subject}}",
      "{{ticket_priority}}",
      "{{category_name}}",
      "{{created_date}}",
      "{{company_name}}",
      "{{support_email}}",
    ],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 2,
    name: "Ticket Resolved",
    subject: "Your ticket #{{ticket_id}} has been resolved",
    body: `Hello {{user_name}},

Great news! Your support ticket has been resolved.

Ticket Details:
- Ticket ID: #{{ticket_id}}
- Subject: {{ticket_subject}}
- Resolved by: {{agent_name}}
- Resolution Date: {{created_date}}

Please review the solution provided in your ticket and let us know if you need any additional assistance.

If your issue is fully resolved, no further action is needed. If you're still experiencing problems, please reply to this email or reopen your ticket.

Thank you for choosing {{company_name}}.

Best regards,
{{company_name}} Support Team`,
    trigger: "ticket_resolved",
    is_active: true,
    variables: [
      "{{user_name}}",
      "{{ticket_id}}",
      "{{ticket_subject}}",
      "{{agent_name}}",
      "{{created_date}}",
      "{{company_name}}",
    ],
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 3,
    name: "SLA Warning",
    subject: "URGENT: Ticket #{{ticket_id}} approaching SLA deadline",
    body: `Hello {{agent_name}},

This is an automated reminder that ticket #{{ticket_id}} is approaching its SLA deadline.

Ticket Details:
- Ticket ID: #{{ticket_id}}
- Subject: {{ticket_subject}}
- Priority: {{ticket_priority}}
- Customer: {{user_name}}
- Due Date: {{due_date}}

Please prioritize this ticket to ensure we meet our service level agreement.

You can view the ticket details at: {{company_name}}/tickets/{{ticket_id}}

Best regards,
{{company_name}} System`,
    trigger: "sla_warning",
    is_active: true,
    variables: [
      "{{agent_name}}",
      "{{ticket_id}}",
      "{{ticket_subject}}",
      "{{ticket_priority}}",
      "{{user_name}}",
      "{{due_date}}",
      "{{company_name}}",
    ],
    created_at: new Date(Date.now() - 86400000 * 21).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
]

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const { currentUser, setCurrentUser, users } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    // Set a default admin user if no user is logged in (for demo purposes)
    if (!currentUser) {
      const defaultAdmin = users.find(user => user.role === "admin")
      if (defaultAdmin) {
        setCurrentUser(defaultAdmin)
      }
    }
  }, [currentUser, setCurrentUser, users])

  useEffect(() => {
    // Only admins can access email templates
    if (currentUser && currentUser.role !== "admin") {
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

  if (currentUser.role !== "admin") {
    return null
  }

  const handleCreateTemplate = (templateData: any) => {
    const newTemplate = {
      id: Math.max(...templates.map((t) => t.id)) + 1,
      ...templateData,
      variables: [],
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

  const handleSendTest = (templateId: number, email: string) => {
    // Mock sending test email
    console.log(`Sending test email for template ${templateId} to ${email}`)
    // In real app, this would call an API to send the test email
  }

  return (
    <EmailTemplates
      templates={templates}
      onCreateTemplate={handleCreateTemplate}
      onUpdateTemplate={handleUpdateTemplate}
      onDeleteTemplate={handleDeleteTemplate}
      onSendTest={handleSendTest}
    />
  )
}
