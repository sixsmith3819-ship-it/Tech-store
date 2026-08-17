import type { Product } from '@/types/database'

/**
 * Determine stock status based on quantity
 */
export function getStockStatus(quantity: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity === 0) return 'out_of_stock'
  if (quantity <= 5) return 'low_stock'
  return 'in_stock'
}

/**
 * Get stock status label and color
 */
export function getStockStatusDisplay(status: string) {
  const statuses: Record<string, { label: string; color: string }> = {
    in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800' },
    low_stock: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  }
  return statuses[status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
}

/**
 * Check if product is available for purchase
 */
export function isProductAvailable(product: Product): boolean {
  return product.status !== 'out_of_stock' && product.stock_quantity > 0
}

/**
 * Search products by name or description
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const lowerQuery = query.toLowerCase()
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter products by category
 */
export function filterByCategory(products: Product[], categoryId: string): Product[] {
  if (!categoryId) return products
  return products.filter(product => product.category_id === categoryId)
}

/**
 * Sort products
 */
export function sortProducts(
  products: Product[],
  sortBy: 'name' | 'price_low' | 'price_high' | 'newest'
): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    default:
      return sorted
  }
}

/**
 * Validate product data
 */
export function validateProduct(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name?.trim()) errors.push('Product name is required')
  if (!data.sku?.trim()) errors.push('SKU is required')
  if (!data.category_id?.trim()) errors.push('Category is required')
  if (!data.description?.trim()) errors.push('Description is required')
  if (data.price <= 0) errors.push('Price must be greater than 0')
  if (data.stock_quantity < 0) errors.push('Stock quantity cannot be negative')

  return {
    valid: errors.length === 0,
    errors,
  }
}
