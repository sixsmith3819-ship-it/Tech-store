'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { Search, Filter, X, Sparkles, TrendingUp, ShoppingCart } from 'lucide-react'
import { SERVICE_TYPES } from '@/constants'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  description: string
  detailed_description?: string
  price: number
  service_type: string
  image_url?: string
  status: string
}

export const dynamic = 'force-dynamic'

function ServicesPageContent() {
  const searchParams = useSearchParams()
  const initialServiceType = searchParams.get('serviceType') || ''
  const initialSearch = searchParams.get('search') || ''
  const initialSort = searchParams.get('sort') || 'name'
  const { addItem } = useCart()

  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedServiceType, setSelectedServiceType] = useState(initialServiceType)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [sortBy, setSortBy] = useState(initialSort)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [selectedServiceType, searchTerm, sortBy])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (selectedServiceType) params.append('serviceType', selectedServiceType)
      if (searchTerm) params.append('search', searchTerm)
      params.append('sort', sortBy)

      const response = await fetch(`/api/services/browse?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch services')
        setServices([])
        return
      }

      setServices(data.services || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleAddToCart = (service: Service) => {
    addItem({
      cart_key: `${service.id}-false`,
      product_id: service.id,
      product_name: service.name,
      price: service.price,
      quantity: 1,
      sku: `SERVICE-${service.service_type}`,
      installation_selected: false,
      installation_fee: 0,
      installation_description: undefined,
    })
    setAddedToCart(service.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Professional Services</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-3">
            Services
          </h1>
          <p className="text-slate-300 text-lg">Explore our professional technical services</p>
        </div>

        <div className="bg-surface-elevated2/50 backdrop-blur-xl rounded-2xl border border-slate-600/20 p-6 mb-8 shadow-soft-md animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form onSubmit={handleSearch} className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2">Search</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Service Type
              </label>
              <select
                id="serviceType"
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="w-full px-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
              >
                <option value="">All Services</option>
                {SERVICE_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="sort" className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 px-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="price_high">Price (High to Low)</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {(selectedServiceType || searchTerm) && (
            <button
              onClick={() => {
                setSelectedServiceType('')
                setSearchTerm('')
              }}
              className="mt-4 flex items-center gap-2 text-oracle-400 hover:text-oracle-300 font-medium text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-slide-in">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-slate-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-12 text-center shadow-soft">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Services Found</h2>
            <p className="text-slate-300">
              {searchTerm || selectedServiceType
                ? 'Try adjusting your search or filters'
                : 'No services available at the moment'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-300">
                Showing <span className="font-bold text-white">{services.length}</span> service
                {services.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-500 overflow-hidden shadow-soft hover:shadow-soft-md hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-transparent group-hover:from-purple-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none"></div>

                  {service.image_url && (
                    <div className="relative h-48 overflow-hidden bg-surface-elevated3">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                  )}

                  <div className="p-6 relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex-1">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {service.detailed_description && (
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {service.detailed_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-white/5">
                      <div>
                        <p className="text-sm text-gray-400">Starting at</p>
                        <p className="text-2xl font-bold text-oracle-400">${service.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(service)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          addedToCart === service.id
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-soft hover:shadow-glow transform hover:scale-105'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {addedToCart === service.id ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!isLoading && services.length > 0 && (
          <div className="mt-16 text-center">
            <p className="text-slate-300 mb-6">
              Need a custom service? Contact our team for a personalized quote.
            </p>
            <Link
              href="/dashboard/services/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
            >
              Request Custom Service
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-base flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div><p className="text-slate-400">Loading...</p></div></div>}>
      <ServicesPageContent />
    </Suspense>
  )
}
