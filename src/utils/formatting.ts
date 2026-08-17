// Currency formatting
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Date and time formatting
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Generate order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

// Generate service request number
export const generateServiceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `SRV-${timestamp}-${random}`
}

// Generate message/conversation ID
export const generateMessageId = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `MSG-${timestamp}-${random}`
}

// SKU validation
export const isValidSKU = (sku: string): boolean => {
  return /^[A-Z0-9\-]{3,20}$/.test(sku)
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/
  return phoneRegex.test(phone)
}
