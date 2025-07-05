import React from 'react'
import Navbar from '../(site)/Navbar'

export default function AboutPage() {
  return (
    <div className="relative bg-black/20">
      {/* Background GIF */}
      <img
        src="/LandingPage/LandingBackground.jpg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      />

      <Navbar />
    
      <h1 className="text-4xl font-bold text-white m-8 pt-10 mx-auto">About Us</h1>
      <p className="text-base sm:text-lg text-white m-4 sm:m-8 md:m-14 max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
        Welcome to the About Us page!
      </p>
    </div>
  )
}

