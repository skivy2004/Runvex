'use client'

import HeroSection from './components/sections/HeroSection'
import { FloatingHeader } from './components/ui/floating-header'
import StatsBar from './components/sections/StatsBar'
import SocialProof from './components/sections/SocialProof'
import WhyRunvex from './components/sections/WhyRunvex'
import HowItWorks from './components/sections/HowItWorks'
import Integrations from './components/sections/Integrations'
import DemoCards from './components/sections/DemoCards'
import ProductShowcase from './components/sections/ProductShowcase'
import Testimonials from './components/sections/Testimonials'
import Pricing from './components/sections/Pricing'
import FAQ from './components/sections/FAQ'
import About from './components/sections/About'
import BookingSection from './components/sections/BookingSection'
import CTASection from './components/sections/CTASection'
import Footer from './components/layout/Footer'

export default function Home() {
  return (
    <>
      <main>
        <FloatingHeader />
        <HeroSection />
        <StatsBar />
        <SocialProof />
        <WhyRunvex />
        <HowItWorks />
        <Integrations />
        <DemoCards />
        <ProductShowcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <About />
        <BookingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
