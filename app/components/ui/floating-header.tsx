'use client'

import React from 'react'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter } from './sheet'
import { Button, buttonVariants } from './button'
import { cn } from '@/app/lib/utils'

const links = [
  { label: 'Features',   href: '/#features' },
  { label: 'Oplossing',  href: '/#hoe-het-werkt' },
  { label: 'Demo\'s',   href: '/#demos' },
  { label: 'Prijzen',    href: '/#pricing' },
]

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false)

  return (
    <header
      className={cn(
        'sticky top-4 z-50',
        'mx-auto w-full max-w-3xl rounded-xl',
      )}
      style={{
        background: 'rgba(10,11,15,0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(91,110,245,0.08)',
      }}
    >
      <nav className="flex items-center justify-between px-3 py-2">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/05 transition-colors">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}
          >R</div>
          <span className="font-bricolage font-bold text-white text-sm tracking-tight">runvex</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
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
            href="/demos/lead-automation/dashboard"
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'hidden sm:inline-flex')}
          >
            Log in →
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
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}
                  >R</div>
                  <span className="font-bricolage font-bold text-white text-sm">runvex</span>
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
              <SheetFooter>
                <a
                  href="/demos/lead-automation/dashboard"
                  className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center')}
                  onClick={() => setOpen(false)}
                >
                  Log in →
                </a>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
