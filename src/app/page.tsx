'use client'

import Link from 'next/link'
import { PRODUCT_CATEGORIES, SERVICE_TYPES } from '@/constants'
import { ArrowRight, Zap, Shield, Users, Sparkles, TrendingUp, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="w-full bg-surface-base text-slate-100 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <div className="space-y-8 animate-slide-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oracle-500/20 border border-oracle-400/50 w-fit">
                    <Sparkles size={16} className="text-oracle-400" />
                    <span className="text-sm font-semibold text-oracle-300">Welcome to the Future</span>
                  </div>
                  <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-oracle-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Enterprise Technology Redefined
                  </h1>
                  <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                    Discover cutting-edge products and professional services designed for businesses that demand excellence. Your innovation partner starts here.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/products" 
                    className="group relative px-8 py-4 bg-gradient-to-r from-oracle-500 to-oracle-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Explore Products</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/services" 
                    className="px-8 py-4 rounded-xl font-bold text-white border-2 border-oracle-400/50 hover:bg-oracle-400/20 transition-all duration-300 backdrop-blur-sm"
                  >
                    View Services
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-oracle-400">500+</div>
                    <div className="text-sm text-slate-400">Products</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-oracle-400">10K+</div>
                    <div className="text-sm text-slate-400">Happy Clients</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-oracle-400">24/7</div>
                    <div className="text-sm text-slate-400">Support</div>
                  </div>
                </div>
              </div>

              {/* Right side - 3D like effect */}
              <div className="relative hidden lg:flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-oracle-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-oracle-600/20 to-transparent rounded-3xl backdrop-blur-xl border border-oracle-400/20"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-oracle-400/30 to-transparent rounded-2xl flex items-center justify-center">
                    <div className="text-8xl">💻</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-oracle-300 to-blue-300 bg-clip-text text-transparent">
                Shop by Category
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Browse our extensive collection of enterprise-grade technology solutions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCT_CATEGORIES.slice(0, 8).map((category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-oracle-500/10 to-purple-500/10 border border-oracle-400/20 p-8 hover:border-oracle-400/50 transition-all duration-500 hover:shadow-glow transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-oracle-600/0 to-purple-600/0 group-hover:from-oracle-600/10 group-hover:to-purple-600/10 transition-all duration-500"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-300">📦</div>
                    <h3 className="font-bold text-xl group-hover:text-oracle-300 transition-colors">{category.name}</h3>
                    <div className="flex items-center gap-2 text-oracle-400 group-hover:gap-3 transition-all">
                      <span className="text-sm">Explore</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-oracle-300 to-blue-300 bg-clip-text text-transparent">
                Professional Services
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Expert technical support and installation from certified professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICE_TYPES.slice(0, 6).map((service, index) => (
                <div 
                  key={service.id} 
                  className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 p-8 hover:border-blue-400/50 transition-all duration-500 hover:shadow-glow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-all duration-500"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="inline-block p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                      <Zap size={24} className="text-blue-400" />
                    </div>
                    <h3 className="font-bold text-xl group-hover:text-blue-300 transition-colors">{service.name}</h3>
                    <p className="text-slate-300 group-hover:text-slate-200 transition-colors">Professional {service.name.toLowerCase()} services for your business</p>
                    <div className="flex items-center gap-2 text-blue-400 group-hover:gap-3 transition-all">
                      <span className="text-sm">Learn more</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/services" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                <span>Request a Service</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 p-8 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/10 group-hover:to-teal-600/10 transition-all duration-500"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-block p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <Shield size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-xl">Quality Assured</h3>
                  <p className="text-slate-300">Curated selection of enterprise-grade technology and equipment</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 p-8 hover:border-orange-400/50 transition-all duration-500 hover:shadow-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-red-600/0 group-hover:from-orange-600/10 group-hover:to-red-600/10 transition-all duration-500"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-block p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                    <TrendingUp size={24} className="text-orange-400" />
                  </div>
                  <h3 className="font-bold text-xl">Expert Support</h3>
                  <p className="text-slate-300">Professional installation and technical support from experienced technicians</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 p-8 hover:border-purple-400/50 transition-all duration-500 hover:shadow-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-block p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                    <Clock size={24} className="text-purple-400" />
                  </div>
                  <h3 className="font-bold text-xl">Always Available</h3>
                  <p className="text-slate-300">Dedicated support team ready to assist 24/7 with orders and services</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-oracle-600/20 via-purple-600/20 to-blue-600/20 border border-oracle-400/30 p-12 lg:p-16">
              <div className="absolute inset-0 bg-gradient-to-r from-oracle-600/0 via-transparent to-blue-600/0"></div>
              <div className="relative z-10 text-center space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-oracle-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who trust Oracle Tech Store for their technology needs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link 
                    href="/products" 
                    className="group relative px-8 py-4 bg-gradient-to-r from-oracle-500 to-oracle-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/contact" 
                    className="px-8 py-4 rounded-xl font-bold text-white border-2 border-oracle-400/50 hover:bg-oracle-400/20 transition-all duration-300 backdrop-blur-sm"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-oracle-400/10 py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto text-center text-slate-400">
            <p className="mb-4">© 2024 Oracle Tech Store. All rights reserved.</p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/about" className="hover:text-oracle-400 transition">About</Link>
              <Link href="/contact" className="hover:text-oracle-400 transition">Contact</Link>
              <Link href="/products" className="hover:text-oracle-400 transition">Products</Link>
              <Link href="/services" className="hover:text-oracle-400 transition">Services</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
