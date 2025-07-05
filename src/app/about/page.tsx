import React from "react";
import Navbar from "../(site)/Navbar";

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

      {/* <h1 className="text-4xl font-bold text-white m-8 pt-10 mx-auto">
        About Awareness Living
      </h1> */}

      <h1
        className="text-4xl font-bold text-white pt-10
      m-4 sm:m-8 md:m-14 max-w-sm sm:max-w-md md:max-w-2xl 
      mx-auto"
      >
        Hello, I'm Benjamin Koh!
      </h1>

      <div className="flex flex-row items-center justify-center min-h-screen m-20">
        <div className="w-14 flex-1">
          <img
            src="/LandingPage/FakePerson1.jpeg"
            alt="Logo"
            className="w-full h-auto"
          />
        </div>

        <div className="w-28 flex-1">
          <p className="text-base sm:text-lg text-white m-4 sm:m-8 md:m-14 max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
            I'm a Tarot Card Reading/Numerology Consultant with more than 12
            years of experience. I provide assistance & guidance to clients who
            face difficult situations to solve their personal problems & life
            issues. <br /> <br />I am also an experienced Energy Healer in
            Quantum Touch & Pranic Healing.


            <br /> <br />
            My mission is to help individuals achieve greater self-awareness, personal growth,
            and spiritual enlightenment through the transformative power of Tarot
            readings and energy healing.
            
          </p>
        </div>

      </div>


      <h1
        className="text-4xl font-bold text-white pt-10
      m-4 sm:m-8 md:m-14 max-w-sm sm:max-w-md md:max-w-2xl 
      mx-auto"
      >
        Hello, I'm Benjamin Koh!
      </h1>

      <div className="flex flex-row items-center justify-center min-h-screen m-20">
        <div className="w-14 flex-1">
          <img
            src="/LandingPage/FakePerson1.jpeg"
            alt="Logo"
            className="w-full h-auto"
          />
        </div>

        <div className="w-28 flex-1">
          <p className="text-base sm:text-lg text-white m-4 sm:m-8 md:m-14 max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
            I'm a Tarot Card Reading/Numerology Consultant with more than 12
            years of experience. I provide assistance & guidance to clients who
            face difficult situations to solve their personal problems & life
            issues. <br /> <br />I am also an experienced Energy Healer in
            Quantum Touch & Pranic Healing.


            <br /> <br />
            My mission is to help individuals achieve greater self-awareness, personal growth,
            and spiritual enlightenment through the transformative power of Tarot
            readings and energy healing.
            
          </p>
        </div>

    
      </div>


      

    </div>
  );
}
