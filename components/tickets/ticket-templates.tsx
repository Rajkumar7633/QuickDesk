"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { FileText, Plus, Edit, Trash2, Copy, Star } from "lucide-react"

interface TicketTemplate {
  id: number
  name: string
  description: string
  subject_template: string
  body_template: string
  category_id: number
  priority: string
  tags: string[]
  is_featured: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

interface TicketTemplatesProps {
  templates: TicketTemplate[]
  categories: any[]
  onCreateTemplate: (template: any) => void
  onUpdateTemplate: (id: number, template: any) => void
  onDeleteTemplate: (id: number) => void
  onUseTemplate: (template: TicketTemplate) => void
}

export function TicketTemplates({
  templates,
  categories,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onUseTemplate,
}: TicketTemplatesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TicketTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || template.category_id.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredTemplates = templates.filter((template) => template.is_featured)
  const popularTemplates = templates.sort((a, b) => b.usage_count - a.usage_count).slice(0, 5)

  const handleCreateTemplate = (formData: FormData) => {
    const templateData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      subject_template: formData.get("subject_template") as string,
      body_template: formData.get("body_template") as string,
      category_id: Number.parseInt(formData.get("category_id") as string),
      priority: formData.get("priority") as string,
      tags: (formData.get("tags") as string).split(",").map((tag) => tag.trim()),
      is_featured: formData.get("is_featured") === "on",
    }
    onCreateTemplate(templateData)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTemplate = (formData: FormData) => {
    if (!editingTemplate) return

    const templateData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      subject_template: formData.get("subject_template") as string,
      body_template: formData.get("body_template") as string,
      category_id: Number.parseInt(formData.get("category_id") as string),
      priority: formData.get("priority") as string,
      tags: (formData.get("tags") as string).split(",").map((tag) => tag.trim()),
      is_featured: formData.get("is_featured") === "on",
    }
    onUpdateTemplate(editingTemplate.id, templateData)
    setEditingTemplate(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
            <FileText className="h-6 w-6 text-purple-600" />
            <span>Ticket Templates</span>
          </h2>
          <p className="text-muted-foreground">Pre-defined ticket formats for common issues</p>
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
              <DialogTitle>Create Ticket Template</DialogTitle>
              <DialogDescription>Create a reusable template for common ticket types</DialogDescription>
            </DialogHeader>
            <form action={handleCreateTemplate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Password Reset Request" required />
                  </div>
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Select name="category_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Brief description of when to use this template"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Default Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="password, reset, account" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject_template">Subject Template</Label>
                  <Input
                    id="subject_template"
                    name="subject_template"
                    placeholder="e.g., Password Reset Request for {{user_email}}"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="body_template">Body Template</Label>
                  <Textarea
                    id="body_template"
                    name="body_template"
                    placeholder="Template content with placeholders..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="is_featured" name="is_featured" />
                  <Label htmlFor="is_featured">Featured Template</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Template</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredTemplates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Copy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((sum, template) => sum + template.usage_count, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{popularTemplates[0]?.name || "N/A"}</div>
            <div className="text-xs text-muted-foreground">{popularTemplates[0]?.usage_count || 0} uses</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Featured Templates</span>
            </CardTitle>
            <CardDescription>Most commonly used templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredTemplates.map((template) => (
                <div key={template.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{categories.find((c) => c.id === template.category_id)?.name}</Badge>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                    <Badge variant="outline">{template.usage_count} uses</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => onUseTemplate(template)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Templates */}
      <Card>
        <CardHeader>
          <CardTitle>All Templates ({filteredTemplates.length})</CardTitle>
          <CardDescription>Browse and manage all ticket templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No templates found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first template to get started"}
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      {template.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      <Badge variant="outline">{categories.find((c) => c.id === template.category_id)?.name}</Badge>
                      <Badge variant="secondary">{template.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Used {template.usage_count} times • Created {new Date(template.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onUseTemplate(template)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Use
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Ticket Template</DialogTitle>
            <DialogDescription>Update the ticket template</DialogDescription>
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
                    <Label htmlFor="edit-category_id">Category</Label>
                    <Select name="category_id" defaultValue={editingTemplate.category_id.toString()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input id="edit-description" name="description" defaultValue={editingTemplate.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-priority">Default Priority</Label>
                    <Select name="priority" defaultValue={editingTemplate.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                    <Input id="edit-tags" name="tags" defaultValue={editingTemplate.tags.join(", ")} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-subject_template">Subject Template</Label>
                  <Input
                    id="edit-subject_template"
                    name="subject_template"
                    defaultValue={editingTemplate.subject_template}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-body_template">Body Template</Label>
                  <Textarea
                    id="edit-body_template"
                    name="body_template"
                    defaultValue={editingTemplate.body_template}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-is_featured"
                    name="is_featured"
                    defaultChecked={editingTemplate.is_featured}
                  />
                  <Label htmlFor="edit-is_featured">Featured Template</Label>
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
