/**
 * Validation utilities for form inputs
 */

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: 'email', message: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' }
  }

  return null
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationError | null {
  if (!password) {
    return { field: 'password', message: 'Password is required' }
  }

  if (password.length < 6) {
    return { field: 'password', message: 'Password must be at least 6 characters' }
  }

  return null
}

/**
 * Validate passwords match
 */
export function validatePasswordsMatch(
  password: string,
  confirmPassword: string
): ValidationError | null {
  if (password !== confirmPassword) {
    return { field: 'confirmPassword', message: 'Passwords do not match' }
  }

  return null
}

/**
 * Validate full name
 */
export function validateFullName(fullName: string): ValidationError | null {
  if (!fullName) {
    return { field: 'fullName', message: 'Full name is required' }
  }

  if (fullName.trim().length < 2) {
    return { field: 'fullName', message: 'Full name must be at least 2 characters' }
  }

  if (fullName.trim().length > 100) {
    return { field: 'fullName', message: 'Full name must be less than 100 characters' }
  }

  return null
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationError | null {
  if (!phone) {
    return null // Phone is optional
  }

  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/
  if (!phoneRegex.test(phone)) {
    return { field: 'phone', message: 'Please enter a valid phone number' }
  }

  return null
}

/**
 * Validate address
 */
export function validateAddress(address: string): ValidationError | null {
  if (!address) {
    return null // Address is optional
  }

  if (address.trim().length < 5) {
    return { field: 'address', message: 'Address must be at least 5 characters' }
  }

  if (address.trim().length > 255) {
    return { field: 'address', message: 'Address must be less than 255 characters' }
  }

  return null
}

/**
 * Validate signup form
 */
export function validateSignupForm(data: {
  email: string
  fullName: string
  password: string
  confirmPassword: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)

  const fullNameError = validateFullName(data.fullName)
  if (fullNameError) errors.push(fullNameError)

  const passwordError = validatePassword(data.password)
  if (passwordError) errors.push(passwordError)

  const matchError = validatePasswordsMatch(data.password, data.confirmPassword)
  if (matchError) errors.push(matchError)

  return errors
}

/**
 * Validate login form
 */
export function validateLoginForm(data: {
  email: string
  password: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)

  const passwordError = validatePassword(data.password)
  if (passwordError) errors.push(passwordError)

  return errors
}
