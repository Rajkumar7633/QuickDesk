"use server"

import { revalidatePath } from "next/cache"

export async function createUserAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    if (!name || !email || !role) {
      return { success: false, error: "All fields are required" }
    }

    // In a real app, this would save to database
    const user = {
      id: Date.now(),
      name,
      email,
      role,
      created_at: new Date().toISOString(),
    }

    revalidatePath("/users")
    return { success: true, user }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUserAction(userId: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    if (!name || !email || !role) {
      return { success: false, error: "All fields are required" }
    }

    // In a real app, this would update the database
    console.log(`Updating user ${userId}:`, { name, email, role })

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Update user error:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUserAction(userId: number) {
  try {
    // In a real app, this would delete from database
    console.log(`Deleting user ${userId}`)

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function createCategoryAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string

    if (!name) {
      return { success: false, error: "Category name is required" }
    }

    // In a real app, this would save to database
    const category = {
      id: Date.now(),
      name,
      description,
      color: color || "#3b82f6",
      created_at: new Date().toISOString(),
    }

    revalidatePath("/categories")
    return { success: true, category }
  } catch (error) {
    console.error("Create category error:", error)
    return { success: false, error: "Failed to create category" }
  }
}
