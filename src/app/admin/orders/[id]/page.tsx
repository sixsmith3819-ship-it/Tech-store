'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { ORDER_STATUSES } from '@/constants'
import {
  ArrowLeft, Package, Wrench, User, MapPin, Calendar,
  CheckCircle2, Clock, AlertCircle, XCircle, RefreshCw,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  installation_selected: boolean
  installation_fee: number
  installation_description?: string
  installation_status: string
}

interface OrderDetail {
  id: string
  order_number: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  additional_instructions?: string
  total_amount: number
  payment_method?: string
  status: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

// ── Installation status config ─────────────────────────────────────
const INSTALLATION_STATUSES = [
  { id: 'requested',   label: 'Requested',   icon: Clock,          cls: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30' },
  { id: 'scheduled',   label: 'Scheduled',   icon: Calendar,       cls: 'bg-blue-500/15   text-blue-300   border-blue-400/30' },
  { id: 'in_progress', label: 'In Progress', icon: RefreshCw,      cls: 'bg-purple-500/15 text-purple-300 border-purple-400/30' },
  { id: 'completed',   label: 'Completed',   icon: CheckCircle2,   cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  { id: 'cancelled',   label: 'Cancelled',   icon: XCircle,        cls: 'bg-red-500/15    text-red-300    border-red-400/30' },
]

const getInstallStatus = (id: string) =>
  INSTALLATION_STATUSES.find(s => s.id === id) ?? {
    id: 'none', label: 'Not Requested', icon: AlertCircle,
    cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  }

// ── Order status badge ─────────────────────────────────────────────
const ORDER_STATUS_CLS: Record<string, string> = {
  pending:           'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
  confirmed:         'bg-blue-500/15   text-blue-300   border-blue-400/30',
  processing:        'bg-indigo-500/15 text-indigo-300 border-indigo-400/30',
  ready_for_delivery:'bg-purple-500/15 text-purple-300 border-purple-400/30',
  out_for_delivery:  'bg-orange-500/15 text-orange-300 border-orange-400/30',
  completed:         'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  cancelled:         'bg-red-500/15    text-red-300    border-red-400/30',
}

// ─────────────────────────────────────────────────────────────────
export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [error, setError] = useState('')

  // Track per-item installation status updates
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/auth/login'); return }
    if (!authLoading && !isAdmin) { router.push('/dashboard'); return }
  }, [authLoading, isAuthenticated, isAdmin, router])

  // Fetch order
  useEffect(() => {
    if (isAuthenticated && isAdmin && orderId) fetchOrder()
  }, [isAuthenticated, isAdmin, orderId])

  const fetchOrder = async () => {
    try {
      setIsLoadingOrder(true)
      setError('')
      const res = await fetch(`/api/admin/orders/${orderId}`)
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Order not found'); return }
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setIsLoadingOrder(false)
    }
  }

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // ── Update order-level status ─────────────────────────────────────
  const handleOrderStatusChange = async (newStatus: string) => {
    if (!order || updatingOrderStatus) return
    setUpdatingOrderStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to update status'); return }
      setOrder(prev => prev ? { ...prev, status: newStatus } : prev)
      flash(`Order status updated to ${newStatus}`)
    } catch {
      setError('Failed to update order status')
    } finally {
      setUpdatingOrderStatus(false)
    }
  }

  // ── Update per-item installation status ───────────────────────────
  const handleInstallStatusChange = async (itemId: string, newStatus: string) => {
    if (updatingItemId) return
    setUpdatingItemId(itemId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, installation_status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to update installation status'); return }
      setOrder(prev => {
        if (!prev) return prev
        return {
          ...prev,
          order_items: prev.order_items.map(i =>
            i.id === itemId ? { ...i, installation_status: newStatus } : i
          ),
        }
      })
      flash(`Installation status updated to ${newStatus}`)
    } catch {
      setError('Failed to update installation status')
    } finally {
      setUpdatingItemId(null)
    }
  }

  // ── Loading states ────────────────────────────────────────────────
  if (authLoading || isLoadingOrder) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-slate-400">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) return null

  if (error && !order) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-12 text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) return null

  const itemsWithInstall = order.order_items.filter(i => i.installation_selected)
  const productsSubtotal = order.order_items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
  const installSubtotal  = order.order_items.reduce((s, i) => s + i.installation_fee * i.quantity, 0)
  const orderStatusCls   = ORDER_STATUS_CLS[order.status] ?? 'bg-slate-500/15 text-slate-300 border-slate-400/30'
  const currentOrderStatus = ORDER_STATUSES.find(s => s.id === order.status)

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Back */}
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 animate-slide-in">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-3">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Order Details</span>
            </div>
            <h1 className="text-4xl font-bold text-white">#{order.order_number}</h1>
            <p className="text-slate-400 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <span className={`self-start px-4 py-2 rounded-full text-sm font-bold border ${orderStatusCls}`}>
            {currentOrderStatus?.label ?? order.status}
          </span>
        </div>

        {/* Success / error banners */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-xl text-emerald-300 flex items-center gap-2 animate-scale-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2 animate-scale-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column: items + installation ─────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Items */}
            <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-6 shadow-soft animate-slide-in">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-oracle-400" />
                Order Items ({order.order_items.length})
              </h2>

              <div className="space-y-4">
                {order.order_items.map(item => {
                  const installStatus = getInstallStatus(item.installation_status)
                  const InstIcon = installStatus.icon
                  const lineTotal = (item.unit_price + item.installation_fee) * item.quantity

                  return (
                    <div key={item.id} className="bg-surface-elevated3/50 rounded-xl border border-slate-600/20 p-5">
                      {/* Product row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg leading-tight">{item.product_name}</h3>
                          <p className="text-slate-400 text-sm mt-0.5">
                            {item.quantity} × {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-slate-500 mb-0.5">Product subtotal</p>
                          <p className="font-bold text-white">{formatCurrency(item.unit_price * item.quantity)}</p>
                        </div>
                      </div>

                      {/* Installation block */}
                      {item.installation_selected ? (
                        <div className="mt-4 pt-4 border-t border-slate-600/20">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Wrench className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-300">Installation Service</span>
                                <span className="text-sm text-emerald-400 font-bold">
                                  +{formatCurrency(item.installation_fee * item.quantity)}
                                </span>
                              </div>
                              {item.installation_description && (
                                <p className="text-xs text-slate-400 ml-6">{item.installation_description}</p>
                              )}
                            </div>

                            {/* Installation status badge */}
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${installStatus.cls}`}>
                                <InstIcon className="w-3.5 h-3.5" />
                                {installStatus.label}
                              </span>
                            </div>
                          </div>

                          {/* Status changer */}
                          <div className="mt-4">
                            <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Update Installation Status</p>
                            <div className="flex flex-wrap gap-2">
                              {INSTALLATION_STATUSES.map(s => {
                                const SIcon = s.icon
                                const isCurrent = item.installation_status === s.id
                                const isUpdating = updatingItemId === item.id
                                return (
                                  <button
                                    key={s.id}
                                    onClick={() => handleInstallStatusChange(item.id, s.id)}
                                    disabled={isCurrent || isUpdating}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                                      isCurrent
                                        ? `${s.cls} cursor-default`
                                        : 'border-slate-600/30 text-slate-400 hover:border-slate-500/50 hover:text-white bg-surface-elevated3/50 disabled:opacity-40'
                                    }`}
                                  >
                                    {isUpdating && !isCurrent ? (
                                      <div className="w-3.5 h-3.5 border-b-2 border-current rounded-full animate-spin"></div>
                                    ) : (
                                      <SIcon className="w-3.5 h-3.5" />
                                    )}
                                    {s.label}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-slate-600/10">
                          <span className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block"></span>
                            Self-installation — no installation service requested
                          </span>
                        </div>
                      )}

                      {/* Line total */}
                      <div className="mt-3 pt-3 border-t border-slate-600/20 flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Line Total</span>
                        <span className="text-base font-bold text-white">{formatCurrency(lineTotal)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Installation summary (only if any items have installation) */}
            {itemsWithInstall.length > 0 && (
              <div className="bg-emerald-500/8 rounded-2xl border border-emerald-400/20 p-6 shadow-soft animate-slide-in">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-400" />
                  Installation Summary
                </h2>
                <div className="space-y-3">
                  {itemsWithInstall.map(item => {
                    const s = getInstallStatus(item.installation_status)
                    const SIcon = s.icon
                    return (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-surface-elevated3/40 rounded-xl border border-emerald-400/10">
                        <div className="flex items-start gap-3">
                          <Wrench className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-white">{item.product_name}</p>
                            <p className="text-xs text-slate-400">Fee: {formatCurrency(item.installation_fee * item.quantity)}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border self-start sm:self-auto ${s.cls}`}>
                          <SIcon className="w-3.5 h-3.5" />
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: customer, totals, status ─────────────── */}
          <div className="space-y-6">

            {/* Customer info */}
            <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-6 shadow-soft animate-slide-in">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Customer
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Email</p>
                  <p className="text-slate-200 font-medium break-all">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Phone</p>
                  <p className="text-slate-200 font-medium">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Delivery Address
                  </p>
                  <p className="text-slate-200 font-medium whitespace-pre-line">{order.delivery_address}</p>
                </div>
                {order.additional_instructions && (
                  <div>
                    <p className="text-slate-500 text-xs mb-0.5">Instructions</p>
                    <p className="text-slate-300 italic">{order.additional_instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order total breakdown */}
            <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-6 shadow-soft animate-slide-in">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-oracle-400" />
                Order Total
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Products:</span>
                  <span>{formatCurrency(productsSubtotal)}</span>
                </div>
                {installSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-400" />Installation:
                    </span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(installSubtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Payment:</span>
                  <span className="text-slate-200 capitalize">{order.payment_method?.replace('_', ' ') ?? '—'}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-slate-600/20 pt-3 mt-3">
                  <span className="text-white">Grand Total:</span>
                  <span className="text-emerald-400">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Order status manager */}
            <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-6 shadow-soft animate-slide-in">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                Update Order Status
              </h2>
              <div className="space-y-2">
                {ORDER_STATUSES.map(s => {
                  const isCurrent = order.status === s.id
                  const cls = ORDER_STATUS_CLS[s.id] ?? 'bg-slate-500/15 text-slate-300 border-slate-400/30'
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleOrderStatusChange(s.id)}
                      disabled={isCurrent || updatingOrderStatus}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        isCurrent
                          ? `${cls} cursor-default`
                          : 'border-slate-600/20 text-slate-400 hover:border-slate-500/40 hover:text-white bg-surface-elevated3/30 disabled:opacity-40'
                      }`}
                    >
                      <span>{s.label}</span>
                      {isCurrent && (
                        <span className="text-xs opacity-70">Current</span>
                      )}
                      {updatingOrderStatus && !isCurrent && (
                        <div className="w-3.5 h-3.5 border-b-2 border-current rounded-full animate-spin"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
