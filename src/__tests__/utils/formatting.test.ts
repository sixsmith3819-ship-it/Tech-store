import {
  formatCurrency,
  formatDate,
  formatDateTime,
  generateOrderNumber,
  generateServiceNumber,
  generateMessageId,
  isValidEmail,
  isValidPhone,
  isValidSKU,
} from '@/utils/formatting'

describe('Formatting Utilities', () => {
  // Currency Formatting Tests
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-100)).toBe('-$100.00')
    })
  })

  // Date Formatting Tests
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-08-13')
      const result = formatDate(date)
      expect(result).toContain('Aug')
      expect(result).toContain('13')
    })

    it('should handle string dates', () => {
      const result = formatDate('2026-08-13')
      expect(result).toContain('Aug')
    })
  })

  // DateTime Formatting Tests
  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date('2026-08-13T10:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('Aug')
      expect(result).toContain('13')
      expect(result).toMatch(/\d{2}:\d{2}/)
    })
  })

  // ID Generation Tests
  describe('generateOrderNumber', () => {
    it('should generate order number with correct format', () => {
      const orderNum = generateOrderNumber()
      expect(orderNum).toMatch(/^ORD-\d{6}-[A-Z0-9]{5}$/)
    })

    it('should generate unique order numbers', () => {
      const num1 = generateOrderNumber()
      const num2 = generateOrderNumber()
      expect(num1).not.toBe(num2)
    })
  })

  describe('generateServiceNumber', () => {
    it('should generate service number with correct format', () => {
      const serviceNum = generateServiceNumber()
      expect(serviceNum).toMatch(/^SRV-\d{6}-[A-Z0-9]{5}$/)
    })

    it('should generate unique service numbers', () => {
      const num1 = generateServiceNumber()
      const num2 = generateServiceNumber()
      expect(num1).not.toBe(num2)
    })
  })

  describe('generateMessageId', () => {
    it('should generate message ID with correct format', () => {
      const msgId = generateMessageId()
      expect(msgId).toMatch(/^MSG-\d{6}-[A-Z0-9]{8}$/)
    })

    it('should generate unique message IDs', () => {
      const id1 = generateMessageId()
      const id2 = generateMessageId()
      expect(id1).not.toBe(id2)
    })
  })

  // Email Validation Tests
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.user@example.co.uk')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  // Phone Validation Tests
  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('+1 (555) 123-4567')).toBe(true)
      expect(isValidPhone('5551234567')).toBe(true)
      expect(isValidPhone('+1-555-123-4567')).toBe(true)
    })

    it('should reject short phone numbers', () => {
      expect(isValidPhone('555')).toBe(false)
      expect(isValidPhone('123')).toBe(false)
    })
  })

  // SKU Validation Tests
  describe('isValidSKU', () => {
    it('should validate correct SKUs', () => {
      expect(isValidSKU('ABC123')).toBe(true)
      expect(isValidSKU('PROD-001')).toBe(true)
      expect(isValidSKU('SK-12345')).toBe(true)
    })

    it('should reject invalid SKUs', () => {
      expect(isValidSKU('ab')).toBe(false) // too short
      expect(isValidSKU('abc123def456')).toBe(false) // too long
      expect(isValidSKU('abc')).toBe(false) // lowercase
    })
  })
})
