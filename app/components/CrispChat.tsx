'use client'

import { useEffect } from 'react'

const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_ID

export default function CrispChat() {
  useEffect(() => {
    if (!CRISP_ID) return

    // @ts-ignore
    window.$crisp = []
    // @ts-ignore
    window.CRISP_WEBSITE_ID = CRISP_ID

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
