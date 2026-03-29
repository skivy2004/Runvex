'use client'

import HeroSection from './components/sections/HeroSection'
import { FloatingHeader } from './components/ui/floating-header'
import StatsBar from './components/sections/StatsBar'
import WhyRunvex from './components/sections/WhyRunvex'
import HowItWorks from './components/sections/HowItWorks'
import ProductShowcase from './components/sections/ProductShowcase'
import Testimonials from './components/sections/Testimonials'
import CTASection from './components/sections/CTASection'
import DemoCards from './components/sections/DemoCards'
import Footer from './components/layout/Footer'

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <div className="px-4">
          <FloatingHeader />
        </div>
        <StatsBar />
        <WhyRunvex />
        <HowItWorks />
        <DemoCards />
        <ProductShowcase />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
