'use client'

import Link from 'next/link'
import { Code2, Share2, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='relative bg-slate-900 border-t border-oracle-400/20 mt-20'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-oracle-500/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
            {/* Brand */}
            <div className='space-y-4'>
              <div className='bg-gradient-to-br from-oracle-400 to-oracle-600 text-white px-3 py-2 rounded-xl font-bold text-lg w-fit shadow-lg'>
                OTS
              </div>
              <p className='text-slate-300 leading-relaxed'>
                Transforming businesses through innovative technology solutions and expert professional services since 2024.
              </p>
              <div className='flex gap-4 pt-2'>
                <a href='#' className='p-2 rounded-lg bg-oracle-500/20 text-oracle-400 hover:bg-oracle-500/30 transition-all duration-300'>
                  <Code2 size={18} />
                </a>
                <a href='#' className='p-2 rounded-lg bg-oracle-500/20 text-oracle-400 hover:bg-oracle-500/30 transition-all duration-300'>
                  <Share2 size={18} />
                </a>
                <a href='#' className='p-2 rounded-lg bg-oracle-500/20 text-oracle-400 hover:bg-oracle-500/30 transition-all duration-300'>
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Products */}
            <div className='space-y-4'>
              <h3 className='font-bold text-lg text-white'>Products</h3>
              <ul className='space-y-3'>
                <li><Link href='/products' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>Browse All</Link></li>
                <li><Link href='/products?category=1' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>Servers & Storage</Link></li>
                <li><Link href='/products?category=2' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>Networking</Link></li>
                <li><Link href='/products?category=3' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>Security</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className='space-y-4'>
              <h3 className='font-bold text-lg text-white'>Services</h3>
              <ul className='space-y-3'>
                <li><Link href='/services' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>All Services</Link></li>
                <li><Link href='/services/new' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>Request Service</Link></li>
                <li><Link href='/dashboard/services' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>My Services</Link></li>
                <li><Link href='/contact' className='text-slate-300 hover:text-oracle-400 transition-colors duration-300'>Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-oracle-400/10 py-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
              <div className='space-y-2'>
                <h4 className='font-semibold text-white text-sm'>Legal</h4>
                <ul className='space-y-2'>
                  <li><Link href='/privacy' className='text-slate-300 text-sm hover:text-oracle-400 transition-colors'>Privacy Policy</Link></li>
                  <li><Link href='/terms' className='text-slate-300 text-sm hover:text-oracle-400 transition-colors'>Terms of Service</Link></li>
                </ul>
              </div>
              <div className='space-y-2'>
                <h4 className='font-semibold text-white text-sm'>Company</h4>
                <ul className='space-y-2'>
                  <li><Link href='/about' className='text-slate-300 text-sm hover:text-oracle-400 transition-colors'>About Us</Link></li>
                  <li><Link href='/careers' className='text-slate-300 text-sm hover:text-oracle-400 transition-colors'>Careers</Link></li>
                </ul>
              </div>
              <div className='space-y-2'>
                <h4 className='font-semibold text-white text-sm'>Resources</h4>
                <ul className='space-y-2'>
                  <li><Link href='/blog' className='text-slate-300 text-sm hover:text-oracle-400 transition-colors'>Blog</Link></li>
                  <li><Link href='/faq' className='text-slate-300 text-sm hover:text-oracle-400 transition-colors'>FAQ</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className='border-t border-oracle-400/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4'>
              <p className='text-slate-300 text-sm'>
                Copyright {currentYear} Oracle Tech Store. All rights reserved.
              </p>
              <p className='text-slate-300 text-sm'>
                Crafted for tech enthusiasts
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
