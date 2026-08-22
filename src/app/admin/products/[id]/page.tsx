'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, Package, Plus, X, Wrench } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface ProductImage {
  id: string
  image_url: string
  display_order: number
}

interface Product {
  id: string
  category_id: string
  name: string
  sku: string
  description: string
  price: number
  stock_quantity: number
  status: string
  created_at: string
  updated_at: string
  product_images?: ProductImage[]
}

interface EditProductForm {
  category_id: string
  name: string
  sku: string
  description: string
  price: string
  stock_quantity: string
  new_image_urls: string[]
  delete_image_ids: string[]
  // Installation service
  installation_available: boolean
  installation_fee: string
  installation_description: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<EditProductForm>({
    category_id: '',
    name: '',
    sku: '',
    description: '',
    price: '',
    stock_quantity: '',
    new_image_urls: [],
    delete_image_ids: [],
    installation_available: false,
    installation_fee: '0',
    installation_description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [imageInput, setImageInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (!isLoading && !isAdmin) {
      router.push('/dashboard')
      return
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/list')
        const data = await response.json()
        if (response.ok) {
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return

      try {
        setIsLoadingProduct(true)
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()

        if (!response.ok) {
          setErrors({ general: data.message || 'Product not found' })
          return
        }

        const prod = data.product
        setProduct(prod)
        setFormData({
          category_id: prod.category_id,
          name: prod.name,
          sku: prod.sku,
          description: prod.description,
          price: prod.price.toString(),
          stock_quantity: prod.stock_quantity.toString(),
          new_image_urls: [],
          delete_image_ids: [],
          installation_available: prod.installation_available ?? false,
          installation_fee: prod.installation_fee != null ? prod.installation_fee.toString() : '0',
          installation_description: prod.installation_description ?? '',
        })
      } catch (error) {
        setErrors({ general: error instanceof Error ? error.message : 'An error occurred' })
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (isAuthenticated && isAdmin) {
      fetchProduct()
    }
  }, [productId, isAuthenticated, isAdmin])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        new_image_urls: [...prev.new_image_urls, imageInput.trim()],
      }))
      setImageInput('')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          setErrors(prev => ({
            ...prev,
            upload: data.message || 'Failed to upload image',
          }))
          continue
        }

        // Add uploaded image URL to form
        setFormData(prev => ({
          ...prev,
          new_image_urls: [...prev.new_image_urls, data.imageUrl],
        }))
      }

      // Reset file input
      if (e.target) {
        e.target.value = ''
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        upload: error instanceof Error ? error.message : 'Upload failed',
      }))
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      new_image_urls: prev.new_image_urls.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      // Validate form
      const validationErrors: Record<string, string> = {}

      if (!formData.category_id) {
        validationErrors.category_id = 'Category is required'
      }

      if (!formData.name.trim()) {
        validationErrors.name = 'Product name is required'
      }

      if (!formData.sku.trim()) {
        validationErrors.sku = 'SKU is required'
      }

      if (!formData.description.trim()) {
        validationErrors.description = 'Description is required'
      }

      if (!formData.price) {
        validationErrors.price = 'Price is required'
      } else if (parseFloat(formData.price) <= 0) {
        validationErrors.price = 'Price must be greater than 0'
      }

      if (!formData.stock_quantity) {
        validationErrors.stock_quantity = 'Stock quantity is required'
      } else if (parseInt(formData.stock_quantity) < 0) {
        validationErrors.stock_quantity = 'Stock quantity cannot be negative'
      }

      if (formData.installation_available) {
        if (!formData.installation_fee || parseFloat(formData.installation_fee) <= 0) {
          validationErrors.installation_fee = 'Installation fee must be greater than 0 when installation is enabled'
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      // Submit update
      const response = await fetch('/api/products/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          ...formData,
          installation_available: formData.installation_available,
          installation_fee: formData.installation_available ? parseFloat(formData.installation_fee) : 0,
          installation_description: formData.installation_description.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to update product' })
        return
      }

      // Redirect to products page
      router.push('/admin/products')
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isLoadingProduct) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  if (errors.general && !product) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/admin/products" 
            className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center">
            <p className="text-red-400 text-lg">{errors.general}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/admin/products" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-4">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Edit Product</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            {product.name}
          </h1>
          <p className="text-gray-400 text-lg">Update product information</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in" style={{ animationDelay: '100ms' }}>
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={isSubmitting || categories.length === 0}
                className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all [&>option]:bg-gray-900 [&>option]:text-white [&>option]:font-normal ${
                  errors.category_id ? 'border-red-500/50' : 'border-white/10'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-400">{errors.category_id}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all ${
                  errors.name ? 'border-red-500/50' : 'border-white/10'
                }`}
                placeholder="e.g., Oracle Database Server"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-2">
                SKU <span className="text-red-400">*</span>
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all ${
                  errors.sku ? 'border-red-500/50' : 'border-white/10'
                }`}
                placeholder="e.g., ODS-2024-001"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-400">{errors.sku}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all ${
                  errors.description ? 'border-red-500/50' : 'border-white/10'
                }`}
                rows={4}
                placeholder="Describe the product..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                Price <span className="text-red-400">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all ${
                  errors.price ? 'border-red-500/50' : 'border-white/10'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-400">{errors.price}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-300 mb-2">
                Stock Quantity <span className="text-red-400">*</span>
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all ${
                  errors.stock_quantity ? 'border-red-500/50' : 'border-white/10'
                }`}
                placeholder="0"
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-400">{errors.stock_quantity}</p>
              )}
            </div>

            {/* Current Images */}
            {/* ── Installation Service ───────────────────────────── */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Installation Service</h3>
              </div>

              {/* Enable toggle */}
              <div className="flex items-start gap-4 p-4 bg-surface-base rounded-xl border border-white/10 mb-4">
                <div className="relative inline-flex mt-0.5">
                  <input
                    id="installation_available"
                    name="installation_available"
                    type="checkbox"
                    checked={formData.installation_available}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="installation_available"
                    className="w-11 h-6 bg-surface-elevated4 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-oracle-500 rounded-full peer peer-checked:bg-emerald-500 cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 block"
                  ></label>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Offer installation service for this product</p>
                  <p className="text-xs text-gray-400 mt-0.5">Customers will see an option to add professional installation at checkout</p>
                </div>
              </div>

              {/* Fee + description — only shown when enabled */}
              {formData.installation_available && (
                <div className="space-y-4 pl-2 border-l-2 border-emerald-500/30 ml-1 animate-scale-in">
                  <div>
                    <label htmlFor="installation_fee" className="block text-sm font-medium text-gray-300 mb-2">
                      Installation Fee ($) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="installation_fee"
                      name="installation_fee"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.installation_fee}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-surface-base border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all ${
                        errors.installation_fee ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.installation_fee && (
                      <p className="mt-1 text-sm text-red-400">{errors.installation_fee}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="installation_description" className="block text-sm font-medium text-gray-300 mb-2">
                      Installation Description <span className="text-gray-500 font-normal">(shown to customers)</span>
                    </label>
                    <textarea
                      id="installation_description"
                      name="installation_description"
                      value={formData.installation_description}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows={3}
                      className="w-full px-4 py-3 bg-surface-base border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all"
                      placeholder="e.g. Professional CCTV installation by certified technicians. Includes mounting, cabling, and configuration."
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                    <Wrench className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-emerald-300">
                      Installation fee is validated server-side — customers cannot manipulate this value.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Current Images */}
            {product.product_images && product.product_images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Images
                </label>
                <div className="space-y-2">
                  {product.product_images.map((img, index) => (
                    <div key={img.id} className="flex items-center justify-between p-3 bg-surface-base border border-white/10 rounded-lg">
                      <span className="text-sm text-gray-400 truncate">{img.image_url}</span>
                      <span className="text-xs text-gray-500">Order: {img.display_order}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Add New Images
              </label>

              {/* File Upload */}
              <div className="mb-4 p-4 border-2 border-dashed border-oracle-500/30 rounded-xl hover:border-oracle-500/50 transition-colors">
                <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                  <div className="text-oracle-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isSubmitting || isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {errors.upload && (
                <p className="mb-4 text-sm text-red-400">{errors.upload}</p>
              )}

              {/* URL Input */}
              <div className="mb-4 space-y-2">
                <label className="text-xs font-medium text-gray-400">Or paste image URL:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    disabled={isSubmitting || isUploading}
                    className="flex-1 px-4 py-3 bg-surface-base border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all"
                    placeholder="https://example.com/image.jpg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddImage()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={isSubmitting || isUploading || !imageInput.trim()}
                    className="px-4 py-3 bg-oracle-500/20 border border-oracle-400/30 text-oracle-300 rounded-xl hover:bg-oracle-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* New Image List */}
              {formData.new_image_urls.length > 0 && (
                <div className="space-y-2">
                  {formData.new_image_urls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-base border border-white/10 rounded-lg">
                      <span className="text-sm text-gray-400 truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isSubmitting}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow"
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 text-center px-6 py-3 bg-surface-elevated3 border border-white/10 text-white font-bold rounded-xl hover:bg-surface-elevated4 transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}









