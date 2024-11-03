'use client'
import AboutUs from '@/components/custom/sections/about-us'
import ContactUs from '@/components/custom/sections/contact-us'
import Features from '@/components/custom/sections/features'
import Hero from '@/components/custom/sections/hero'
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <Features />

      {/* About Us Section */}
      <AboutUs />

      {/* Contact Us Section */}
      <ContactUs />
    </>
  )
}
