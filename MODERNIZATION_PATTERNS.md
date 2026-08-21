# UI Modernization Patterns - Quick Reference

## Pattern Library for Remaining Pages

### 1. Page Container Pattern

```tsx
<div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
  {/* Aurora Background */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Content here */}
  </div>
</div>
```

### 2. Section Header Pattern

```tsx
<div className="mb-12 animate-fade-in">
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oracle-500/10 border border-oracle-400/20 mb-4">
    <Sparkles className="w-4 h-4 text-oracle-400" />
    <span className="text-sm font-semibold text-oracle-300">Badge Text</span>
  </div>
  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
    Page Title
  </h1>
  <p className="text-gray-400 text-lg">Description text</p>
</div>
```

### 3. Glass Panel Pattern

```tsx
<div className="bg-surface-elevated2/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-soft-md animate-slide-in">
  {/* Content */}
</div>
```

### 4. Bento Grid Dashboard Pattern

```tsx
{/* Bento Grid - Dashboard Layout */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Large Card - Spans 2 columns */}
  <div className="lg:col-span-2 bg-surface-elevated2 rounded-2xl border border-white/10 p-6 hover:border-oracle-400/30 transition-all duration-500 hover:shadow-soft-lg">
    {/* Main stat or feature */}
  </div>

  {/* Regular Cards */}
  <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 hover:border-oracle-400/30 transition-all duration-500">
    {/* Stat */}
  </div>

  <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 hover:border-oracle-400/30 transition-all duration-500">
    {/* Stat */}
  </div>
</div>
```

### 5. Modern Form Input Pattern

```tsx
{/* Search/Text Input */}
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
  />
</div>

{/* Select Dropdown */}
<select className="w-full px-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### 6. Modern Button Patterns

```tsx
{/* Primary Button */}
<button className="bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105">
  Primary Action
</button>

{/* Secondary Button */}
<button className="px-6 py-3 rounded-xl border border-white/10 hover:border-oracle-400/50 hover:bg-oracle-400/10 transition-all duration-300 backdrop-blur-sm text-white">
  Secondary Action
</button>

{/* Danger Button */}
<button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow">
  Delete
</button>
```

### 7. Modern Card Pattern

```tsx
<div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-oracle-400/30 transition-all duration-500 p-6 hover:shadow-soft-lg hover:-translate-y-1">
  {/* Aurora Glow on Hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-oracle-500/0 via-purple-500/0 to-transparent group-hover:from-oracle-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
  
  <div className="relative z-10">
    {/* Card Content */}
  </div>
</div>
```

### 8. Data Table Pattern

```tsx
<div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft">
  <table className="w-full">
    <thead className="bg-surface-elevated3 border-b border-white/10">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-400">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 9. Status Badge Pattern

```tsx
{/* Success Badge */}
<span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
  Active
</span>

{/* Warning Badge */}
<span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30">
  Pending
</span>

{/* Error Badge */}
<span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-400/30">
  Failed
</span>
```

### 10. Loading State Pattern

```tsx
<div className="text-center py-20">
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
  <p className="text-gray-400">Loading...</p>
</div>
```

### 11. Error/Empty State Pattern

```tsx
<div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft">
  <div className="text-6xl mb-4">🔍</div>
  <h2 className="text-2xl font-bold text-white mb-2">No Results</h2>
  <p className="text-gray-400">Description text</p>
</div>
```

### 12. Success Message Pattern

```tsx
<div className="p-4 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl backdrop-blur-sm animate-scale-in">
  ✓ Success message
</div>
```

### 13. Icon Usage (lucide-react)

```tsx
import { 
  ShoppingCart, Eye, Package, Search, Filter, 
  X, Sparkles, TrendingUp, User, LogOut, 
  Settings, Edit, Trash2, Plus, Check 
} from 'lucide-react'

<ShoppingCart className="w-5 h-5 text-oracle-400" />
```

## Color Reference

```tsx
// Backgrounds
bg-surface-base          // #0a0a0a
bg-surface-elevated1     // #121212
bg-surface-elevated2     // #1a1a1a
bg-surface-elevated3     // #222222
bg-surface-elevated4     // #2a2a2a

// Borders
border-white/5          // Very subtle
border-white/10         // Subtle
border-white/20         // Medium
border-oracle-400/20    // Oracle tint
border-oracle-400/30    // Oracle hover
border-oracle-400/50    // Oracle focus

// Text
text-white              // Primary text
text-gray-300           // Secondary text
text-gray-400           // Tertiary text
text-gray-500           // Disabled text

// Oracle Colors
text-oracle-300         // Accent text
text-oracle-400         // Accent medium
bg-oracle-500           // Background
bg-oracle-600           // Background dark

// Aurora Gradients
bg-oracle-500/20        // Subtle oracle glow
bg-purple-500/20        // Subtle purple glow
bg-cyan-500/20          // Subtle cyan glow
```

## Spacing Reference

```tsx
// Padding
p-3, p-4, p-5, p-6, p-8, p-12

// Gaps
gap-2, gap-3, gap-4, gap-6, gap-8

// Margins
mb-2, mb-3, mb-4, mb-6, mb-8, mb-12
mt-2, mt-3, mt-4, mt-6, mt-8, mt-12
```

## Border Radius

```tsx
rounded-lg     // 0.5rem (8px)
rounded-xl     // 0.75rem (12px)
rounded-2xl    // 1rem (16px)
rounded-3xl    // 1.5rem (24px)
rounded-full   // 9999px (circle/pill)
```

## Shadow System

```tsx
shadow-soft      // Soft depth
shadow-soft-md   // Medium depth
shadow-soft-lg   // Large depth
shadow-glow      // Oracle glow effect
```

## Animation Classes

```tsx
animate-fade-in       // Fade in
animate-slide-in      // Slide up
animate-scale-in      // Scale up
animate-float         // Floating (3s)
animate-float-slow    // Slow float (6s)
animate-pulse-glow    // Pulsing glow
hover:-translate-y-1  // Lift on hover
hover:scale-105       // Grow on hover
```

## Responsive Pattern

```tsx
{/* Mobile-first approach */}
<div className="
  grid 
  grid-cols-1         // 1 column on mobile
  sm:grid-cols-2      // 2 columns on small
  md:grid-cols-3      // 3 columns on medium
  lg:grid-cols-4      // 4 columns on large
  gap-4 
  md:gap-6            // Larger gap on desktop
">
```

## Quick Conversion Guide

### Old → New

```tsx
// Backgrounds
bg-white → bg-surface-elevated2
bg-gray-50 → bg-surface-base
bg-gray-100 → bg-surface-elevated1

// Text
text-gray-900 → text-white
text-gray-600 → text-gray-400
text-gray-700 → text-gray-300

// Borders
border-gray-300 → border-white/10
border-gray-200 → border-white/5

// Buttons
bg-oracle-600 → bg-gradient-to-r from-oracle-500 to-oracle-600
bg-blue-500 → bg-gradient-to-r from-blue-500 to-blue-600
```

This pattern library provides everything needed to modernize the remaining pages while maintaining consistency!
