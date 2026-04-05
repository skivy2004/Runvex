'use client'

import React from 'react'
import Image from 'next/image'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter } from './sheet'
import { Button, buttonVariants } from './button'
import { cn } from '@/app/lib/utils'

const links = [
  { label: 'Features',   href: '/#features' },
  { label: 'Oplossing',  href: '/#hoe-het-werkt' },
  { label: 'Demo\'s',   href: '/#demos' },
]

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false)
  const [visible] = React.useState(true)

  return (
    <header
      className={cn(
        'fixed top-4 left-4 right-4 z-50',
        'mx-auto w-full max-w-3xl rounded-xl',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
      )}
      style={{
        background: 'rgba(10,11,15,0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(91,110,245,0.08)',
      }}
    >
      <nav className="relative flex items-center justify-between px-3 py-2">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/05 transition-colors">
          <Image src="/logo.png" alt="Runvex" width={80} height={24} className="h-6 w-auto" />
        </a>

        {/* Desktop links — absolute center */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href="/#booking"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #5B6EF5, #7B5EF5)',
              boxShadow: '0 0 16px rgba(91,110,245,0.45)',
            }}
          >
            Boek een call
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/demos/lead-automation/dashboard"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex text-[#8A8FA8]')}
          >
            Log in
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="lg:hidden h-8 w-8"
            >
              <MenuIcon className="size-4" />
            </Button>
            <SheetContent side="left" showClose={true}>
              <div className="px-4 pt-12 pb-4">
                <a href="/" className="flex items-center gap-2 mb-8">
                  <Image src="/logo.png" alt="Runvex" width={80} height={24} className="h-6 w-auto" />
                </a>
                <div className="flex flex-col gap-1">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start')}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <SheetFooter className="flex flex-col gap-2">
                <a
                  href="/#booking"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #5B6EF5, #7B5EF5)', boxShadow: '0 0 16px rgba(91,110,245,0.35)' }}
                >
                  Boek een call →
                </a>
                <a
                  href="/demos/lead-automation/dashboard"
                  className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-center')}
                  onClick={() => setOpen(false)}
                >
                  Log in
                </a>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
