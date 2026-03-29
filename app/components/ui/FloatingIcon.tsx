'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingIconProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export default function FloatingIcon({
  children,
  delay = 0,
  duration = 3,
  className = '',
}: FloatingIconProps) {
  return (
    <motion.div
      className={`flex items-center justify-center w-12 h-12 rounded-xl ${className}`}
      style={{
        background: 'var(--bg-3)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
