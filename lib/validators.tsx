/**
 * Equipment validators
 */
export const equipmentValidators = {
  validateName: (name: string) => {
    if (!name || typeof name !== "string") return "Name is required"
    if (name.trim().length < 2) return "Name must be at least 2 characters"
    if (name.length > 200) return "Name cannot exceed 200 characters"
    return null
  },

  validateCategory: (category: string) => {
    const validCategories = ["sports", "lab", "classroom", "multimedia", "library", "other"]
    if (!validCategories.includes(category)) return "Invalid category"
    return null
  },

  validateCondition: (condition: string) => {
    const validConditions = ["excellent", "good", "fair", "poor"]
    if (!validConditions.includes(condition)) return "Invalid condition"
    return null
  },

  validateQuantity: (quantity: number, availableQuantity?: number) => {
    if (typeof quantity !== "number" || quantity < 1) return "Quantity must be at least 1"
    if (!Number.isInteger(quantity)) return "Quantity must be a whole number"
    if (availableQuantity !== undefined && quantity < availableQuantity) {
      return "Total quantity cannot be less than available quantity"
    }
    return null
  },

  validateEquipment: (data: any) => {
    const errors: Record<string, string> = {}

    const nameError = equipmentValidators.validateName(data.name)
    if (nameError) errors.name = nameError

    const categoryError = equipmentValidators.validateCategory(data.category)
    if (categoryError) errors.category = categoryError

    if (data.condition) {
      const conditionError = equipmentValidators.validateCondition(data.condition)
      if (conditionError) errors.condition = conditionError
    }

    const quantityError = equipmentValidators.validateQuantity(data.quantity, data.availableQuantity)
    if (quantityError) errors.quantity = quantityError

    return Object.keys(errors).length > 0 ? errors : null
  },
}

/**
 * Request validators
 */
export const requestValidators = {
  validateQuantity: (quantity: number) => {
    if (!quantity || typeof quantity !== "number") return "Quantity is required"
    if (quantity < 1) return "Quantity must be at least 1"
    if (!Number.isInteger(quantity)) return "Quantity must be a whole number"
    return null
  },

  validateDueDate: (dueDate: any) => {
    if (!dueDate) return "Due date is required"
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) return "Invalid due date format"
    if (date <= new Date()) return "Due date must be in the future"
    return null
  },

  validateStatus: (status: string) => {
    const validStatuses = ["pending", "approved", "rejected", "returned"]
    if (!validStatuses.includes(status)) return "Invalid request status"
    return null
  },

  validateRequest: (data: any) => {
    const errors: Record<string, string> = {}

    const quantityError = requestValidators.validateQuantity(data.quantity)
    if (quantityError) errors.quantity = quantityError

    const dueDateError = requestValidators.validateDueDate(data.dueDate)
    if (dueDateError) errors.dueDate = dueDateError

    return Object.keys(errors).length > 0 ? errors : null
  },
}

/**
 * User validators
 */
export const userValidators = {
  validateName: (name: string) => {
    if (!name || typeof name !== "string") return "Name is required"
    if (name.trim().length < 2) return "Name must be at least 2 characters"
    if (name.length > 100) return "Name cannot exceed 100 characters"
    return null
  },

  validateEmail: (email: string) => {
    if (!email || typeof email !== "string") return "Email is required"
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) return "Invalid email format"
    return null
  },

  validatePassword: (password: string) => {
    if (!password || typeof password !== "string") return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters"
    if (password.length > 128) return "Password is too long"
    return null
  },

  validateRole: (role: string) => {
    const validRoles = ["student", "staff", "admin"]
    if (!validRoles.includes(role)) return "Invalid user role"
    return null
  },

  validateRegistration: (data: any) => {
    const errors: Record<string, string> = {}

    const nameError = userValidators.validateName(data.name)
    if (nameError) errors.name = nameError

    const emailError = userValidators.validateEmail(data.email)
    if (emailError) errors.email = emailError

    const passwordError = userValidators.validatePassword(data.password)
    if (passwordError) errors.password = passwordError

    const roleError = userValidators.validateRole(data.role)
    if (roleError) errors.role = roleError

    return Object.keys(errors).length > 0 ? errors : null
  },

  validateLogin: (data: any) => {
    const errors: Record<string, string> = {}

    const emailError = userValidators.validateEmail(data.email)
    if (emailError) errors.email = emailError

    if (!data.password) errors.password = "Password is required"

    return Object.keys(errors).length > 0 ? errors : null
  },
}

/**
 * Notification validators
 */
export const notificationValidators = {
  validateType: (type: string) => {
    const validTypes = ["due-date-reminder", "overdue-alert", "return-reminder", "approved", "rejected"]
    if (!validTypes.includes(type)) return "Invalid notification type"
    return null
  },

  validateTitle: (title: string) => {
    if (!title || typeof title !== "string") return "Title is required"
    if (title.length < 3) return "Title must be at least 3 characters"
    if (title.length > 100) return "Title cannot exceed 100 characters"
    return null
  },

  validateMessage: (message: string) => {
    if (!message || typeof message !== "string") return "Message is required"
    if (message.length < 10) return "Message must be at least 10 characters"
    if (message.length > 500) return "Message cannot exceed 500 characters"
    return null
  },
}

/**
 * Pagination validators
 */
export const paginationValidators = {
  validatePage: (page: any) => {
    const pageNum = Number.parseInt(page) || 1
    if (pageNum < 1) return 1
    return pageNum
  },

  validateLimit: (limit: any) => {
    const limitNum = Number.parseInt(limit) || 10
    if (limitNum < 1) return 1
    if (limitNum > 100) return 100
    return limitNum
  },

  validateSortOrder: (order: any) => {
    return order === "asc" ? 1 : -1
  },
}

/**
 * General utility validators
 */
export const generalValidators = {
  sanitizeString: (str: string) => {
    if (typeof str !== "string") return ""
    return str.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")
  },

  isValidObjectId: (id: any) => {
    return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
  },

  isValidDate: (date: any) => {
    const d = new Date(date)
    return d instanceof Date && !isNaN(d.getTime())
  },
}
