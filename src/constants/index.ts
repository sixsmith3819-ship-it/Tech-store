// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: 'laptops', name: 'Laptops' },
  { id: 'networking-equipment', name: 'Networking Equipment' },
  { id: 'networking-tools', name: 'Networking Tools' },
  { id: 'wifi-extenders', name: 'Wi-Fi & Extenders' },
  { id: 'starlink', name: 'Starlink' },
  { id: 'network-cabinets', name: 'Network Cabinets' },
  { id: 'security-cctv', name: 'Security & CCTV' },
  { id: 'accessories', name: 'Accessories' },
]

// Service Types (can be used as array or mapped)
export const SERVICE_TYPES = [
  { id: 'maintenance', name: 'System Maintenance' },
  { id: 'installation', name: 'Installation Service' },
  { id: 'consulting', name: 'Technical Consulting' },
  { id: 'support', name: 'Technical Support' },
  { id: 'troubleshooting', name: 'Troubleshooting' },
  { id: 'custom', name: 'Custom Service' },
]

// Order Statuses (array format)
export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending', color: '#fef3c7', textColor: '#92400e' },
  { id: 'confirmed', label: 'Confirmed', color: '#dbeafe', textColor: '#1e40af' },
  { id: 'processing', label: 'Processing', color: '#e0e7ff', textColor: '#3730a3' },
  { id: 'ready_for_delivery', label: 'Ready for Delivery', color: '#f3e8ff', textColor: '#6b21a8' },
  { id: 'out_for_delivery', label: 'Out for Delivery', color: '#fed7aa', textColor: '#92400e' },
  { id: 'completed', label: 'Completed', color: '#dcfce7', textColor: '#15803d' },
  { id: 'cancelled', label: 'Cancelled', color: '#fee2e2', textColor: '#b91c1c' },
]

// Service Request Statuses (array format)
export const SERVICE_STATUSES = [
  { id: 'pending', label: 'Pending', color: '#fef3c7', textColor: '#92400e' },
  { id: 'reviewed', label: 'Reviewed', color: '#dbeafe', textColor: '#1e40af' },
  { id: 'scheduled', label: 'Scheduled', color: '#e0e7ff', textColor: '#3730a3' },
  { id: 'in_progress', label: 'In Progress', color: '#f3e8ff', textColor: '#6b21a8' },
  { id: 'completed', label: 'Completed', color: '#dcfce7', textColor: '#15803d' },
  { id: 'cancelled', label: 'Cancelled', color: '#fee2e2', textColor: '#b91c1c' },
]

// Helper: Get status object by id
export const getOrderStatus = (id: string) => ORDER_STATUSES.find(s => s.id === id)
export const getServiceStatus = (id: string) => SERVICE_STATUSES.find(s => s.id === id)
export const getServiceType = (id: string) => SERVICE_TYPES.find(s => s.id === id)

// Helper: Convert constants to objects for lookup
export const SERVICE_TYPES_OBJ: Record<string, string> = SERVICE_TYPES.reduce(
  (acc, item) => ({ ...acc, [item.id]: item.name }),
  {}
)

export const SERVICE_STATUSES_OBJ: Record<string, { label: string; color: string; textColor?: string }> = SERVICE_STATUSES.reduce(
  (acc, item) => ({ ...acc, [item.id]: { label: item.label, color: item.color, textColor: item.textColor } }),
  {}
)

// Message Types
export const MESSAGE_TYPES: Record<string, string> = {
  general: 'General Inquiry',
  order: 'Order Related',
  service: 'Service Related',
  billing: 'Billing',
  technical: 'Technical Support',
  other: 'Other',
}

// Stock Status
export const STOCK_STATUSES = {
  in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800' },
  low_stock: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
}

// Messages per page
export const ITEMS_PER_PAGE = 12
export const MESSAGES_PER_PAGE = 20
