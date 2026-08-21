'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/context/CartContext'
import { Menu, X, ShoppingCart, LogOut, User, LogIn } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { getItemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200' 
        : 'bg-slate-900/90 backdrop-blur-xl border-b border-oracle-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-oracle-400 to-oracle-600 text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-105">
              OTS
            </div>
            <span className={`font-bold text-xl hidden sm:inline transition-colors duration-300 ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Oracle Tech Store
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className={`hidden md:flex gap-8 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-medium transition-colors duration-300 ${
                  scrolled 
                    ? 'hover:text-oracle-600 text-gray-800' 
                    : 'hover:text-oracle-300 text-white'
                } group`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${
                  scrolled 
                    ? 'bg-gradient-to-r from-oracle-600 to-oracle-500' 
                    : 'bg-gradient-to-r from-oracle-300 to-oracle-200'
                } group-hover:w-full transition-all duration-300`}></span>
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex gap-4 items-center">
            <Link 
              href="/cart" 
              className={`relative font-medium transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-oracle-400/20 ${
                scrolled ? 'text-oracle-900' : 'text-white'
              }`}
            >
              <ShoppingCart size={20} />
              Cart
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse-glow">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/dashboard" 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${scrolled ? 'bg-oracle-100' : 'bg-white/10'}`}>
                  <User size={18} className={scrolled ? 'text-oracle-600' : 'text-white'} />
                  <span className={scrolled ? 'text-oracle-900' : 'text-white'}>{user.fullName}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    scrolled 
                      ? 'text-oracle-900 hover:bg-oracle-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-gradient-to-r from-oracle-400 to-oracle-500 text-white px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-300 font-bold transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              scrolled 
                ? 'text-oracle-900 hover:bg-oracle-100' 
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden pb-6 space-y-3 animate-slide-in ${
            scrolled ? 'bg-white' : 'bg-slate-900/95 backdrop-blur-xl'
          }`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 hover:bg-oracle-400/20 ${
                  scrolled ? 'text-oracle-900' : 'text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              href="/cart" 
              className={`block px-4 py-3 rounded-lg transition-all duration-300 hover:bg-oracle-400/20 flex items-center gap-2 ${
                scrolled ? 'text-oracle-900' : 'text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={20} />
              Cart {getItemCount() > 0 && `(${getItemCount()})`}
            </Link>
            {isAuthenticated && user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/dashboard" 
                    className="block px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link 
                  href="/dashboard" 
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 hover:bg-oracle-400/20 ${
                    scrolled ? 'text-oracle-900' : 'text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {user.fullName}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                    scrolled 
                      ? 'bg-oracle-100 text-oracle-900' 
                      : 'bg-white/20 text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-oracle-400 to-oracle-500 text-white font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
