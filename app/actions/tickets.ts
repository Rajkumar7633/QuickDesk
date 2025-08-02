"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTicketAction(formData: FormData) {
  try {
    const subject = formData.get("subject") as string
    const description = formData.get("description") as string
    const category_id = Number.parseInt(formData.get("category_id") as string)
    const priority = (formData.get("priority") as string) || "medium"

    if (!subject || !description || !category_id) {
      return { success: false, error: "Subject, description, and category are required" }
    }

    // In a real app, this would save to database
    const ticket = {
      id: Date.now(),
      subject,
      description,
      category_id,
      priority,
      status: "open",
      created_at: new Date().toISOString(),
    }

    revalidatePath("/tickets")
    revalidatePath("/dashboard")
    redirect("/tickets/my")

    return { success: true, ticket }
  } catch (error) {
    console.error("Create ticket error:", error)
    return { success: false, error: "Failed to create ticket" }
  }
}

export async function updateTicketStatusAction(ticketId: number, status: string) {
  try {
    // In a real app, this would update the database
    console.log(`Updating ticket ${ticketId} to status ${status}`)

    revalidatePath("/tickets")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Update ticket error:", error)
    return { success: false, error: "Failed to update ticket" }
  }
}

export async function addCommentAction(formData: FormData) {
  try {
    const ticket_id = Number.parseInt(formData.get("ticket_id") as string)
    const comment = formData.get("comment") as string
    const is_internal = formData.get("is_internal") === "true"

    if (!ticket_id || !comment) {
      return { success: false, error: "Ticket ID and comment are required" }
    }

    // In a real app, this would save to database
    console.log(`Adding comment to ticket ${ticket_id}: ${comment}`)

    revalidatePath(`/tickets/${ticket_id}`)

    return { success: true }
  } catch (error) {
    console.error("Add comment error:", error)
    return { success: false, error: "Failed to add comment" }
  }
}
