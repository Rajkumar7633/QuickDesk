"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, Plus, Edit, Trash2, Send, Eye } from "lucide-react"
import { useState } from "react"

interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  trigger: string
  is_active: boolean
  variables: string[]
  created_at: string
  updated_at: string
}

interface EmailTemplatesProps {
  templates: EmailTemplate[]
  onCreateTemplate: (template: any) => void
  onUpdateTemplate: (id: number, template: any) => void
  onDeleteTemplate: (id: number) => void
  onSendTest: (templateId: number, email: string) => void
}

const triggerTypes = [
  { value: "ticket_created", label: "Ticket Created" },
  { value: "ticket_updated", label: "Ticket Updated" },
  { value: "ticket_resolved", label: "Ticket Resolved" },
  { value: "ticket_closed", label: "Ticket Closed" },
  { value: "comment_added", label: "Comment Added" },
  { value: "assignment_changed", label: "Assignment Changed" },
  { value: "sla_warning", label: "SLA Warning" },
  { value: "user_registered", label: "User Registered" },
]

const availableVariables = [
  "{{user_name}}",
  "{{ticket_id}}",
  "{{ticket_subject}}",
  "{{ticket_status}}",
  "{{ticket_priority}}",
  "{{agent_name}}",
  "{{category_name}}",
  "{{created_date}}",
  "{{due_date}}",
  "{{comment_text}}",
  "{{company_name}}",
  "{{support_email}}",
]

export function EmailTemplates({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onSendTest,
}: EmailTemplatesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [testEmail, setTestEmail] = useState("")

  const handleCreateTemplate = (formData: FormData) => {
    const templateData = {
      name: formData.get("name") as string,
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      trigger: formData.get("trigger") as string,
      is_active: formData.get("is_active") === "on",
    }
    onCreateTemplate(templateData)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTemplate = (formData: FormData) => {
    if (!editingTemplate) return

    const templateData = {
      name: formData.get("name") as string,
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      trigger: formData.get("trigger") as string,
      is_active: formData.get("is_active") === "on",
    }
    onUpdateTemplate(editingTemplate.id, templateData)
    setEditingTemplate(null)
  }

  const handleSendTest = (templateId: number) => {
    if (testEmail) {
      onSendTest(templateId, testEmail)
      setTestEmail("")
    }
  }

  const renderPreview = (template: EmailTemplate) => {
    // Replace variables with sample data for preview
    let previewSubject = template.subject
    let previewBody = template.body

    const sampleData = {
      "{{user_name}}": "John Doe",
      "{{ticket_id}}": "12345",
      "{{ticket_subject}}": "Login Issues",
      "{{ticket_status}}": "In Progress",
      "{{ticket_priority}}": "High",
      "{{agent_name}}": "Support Agent",
      "{{category_name}}": "Technical Support",
      "{{created_date}}": new Date().toLocaleDateString(),
      "{{due_date}}": new Date(Date.now() + 86400000).toLocaleDateString(),
      "{{comment_text}}": "We are working on resolving your issue.",
      "{{company_name}}": "QuickDesk",
      "{{support_email}}": "support@quickdesk.com",
    }

    Object.entries(sampleData).forEach(([variable, value]) => {
      previewSubject = previewSubject.replace(new RegExp(variable, "g"), value)
      previewBody = previewBody.replace(new RegExp(variable, "g"), value)
    })

    return { subject: previewSubject, body: previewBody }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
            <Mail className="h-6 w-6 text-blue-600" />
            <span>Email Templates</span>
          </h2>
          <p className="text-muted-foreground">Manage automated email notifications and templates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
              <DialogDescription>Create a new automated email template</DialogDescription>
            </DialogHeader>
            <form action={handleCreateTemplate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Ticket Created" required />
                  </div>
                  <div>
                    <Label htmlFor="trigger">Trigger Event</Label>
                    <Select name="trigger" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map((trigger) => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Your ticket #{{ticket_id}} has been created"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    name="body"
                    placeholder="Email content with variables..."
                    className="min-h-[200px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is_active" name="is_active" defaultChecked />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div>
                  <Label>Available Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableVariables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Template</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{template.name}</span>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Trigger: {triggerTypes.find((t) => t.value === template.trigger)?.label}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(template)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Email Preview: {template.name}</DialogTitle>
                        <DialogDescription>Preview with sample data</DialogDescription>
                      </DialogHeader>
                      {previewTemplate && (
                        <div className="space-y-4">
                          <div>
                            <Label>Subject</Label>
                            <div className="p-3 bg-muted rounded-md">{renderPreview(previewTemplate).subject}</div>
                          </div>
                          <div>
                            <Label>Body</Label>
                            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                              {renderPreview(previewTemplate).body}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Test Email</DialogTitle>
                        <DialogDescription>Send a test email to verify the template</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="test-email">Email Address</Label>
                          <Input
                            id="test-email"
                            type="email"
                            placeholder="test@example.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => handleSendTest(template.id)} disabled={!testEmail}>
                          Send Test Email
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => onDeleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Subject:</Label>
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Body Preview:</Label>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.body.substring(0, 150)}...</p>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>Update the email template</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <form action={handleUpdateTemplate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Template Name</Label>
                    <Input id="edit-name" name="name" defaultValue={editingTemplate.name} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-trigger">Trigger Event</Label>
                    <Select name="trigger" defaultValue={editingTemplate.trigger}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map((trigger) => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-subject">Email Subject</Label>
                  <Input id="edit-subject" name="subject" defaultValue={editingTemplate.subject} required />
                </div>
                <div>
                  <Label htmlFor="edit-body">Email Body</Label>
                  <Textarea
                    id="edit-body"
                    name="body"
                    defaultValue={editingTemplate.body}
                    className="min-h-[200px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-is_active" name="is_active" defaultChecked={editingTemplate.is_active} />
                  <Label htmlFor="edit-is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Template</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
