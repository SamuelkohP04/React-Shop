import React from "react";
import Navbar from "../(site)/Navbar";
import { Card } from "@/components/ui/card";
import DeveloperCard from "@/components/DeveloperCard";

export default function AboutPage() {
  const developers = [
    {
      title: "Samuel Koh",
      image: "/LandingPage/FakePerson1.jpeg",
    },
    {
      title: "Koh Chin Teck",
      image: "/LandingPage/FakePerson2.jpeg",
    },
    {
      title: "Ong Xin Yin",
      image: "/LandingPage/FakePerson3.jpeg",
    },
    {
      title: "Ong Xin Yin",
      image: "/LandingPage/FakePerson1.jpeg",
    },

    {
      title: "Ong Xin Yin",
      image: "/LandingPage/FakePerson1.jpeg",
    },

    {
      title: "Ong Xin Yin",
      image: "/LandingPage/FakePerson1.jpeg",
    },
  ];



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

      <div className="max-w-6xl mx-auto">
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
        Our Consultation Booking Automation Team
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {developers.map((developer, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div
                className="w-full aspect-square bg-gray-300 rounded-lg overflow-hidden 
                flex items-center justify-center text-white font-semibold text-lg 
                transform transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundImage: `url('${developer.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* If image is missing */}
                {!developer.image && "PLACEHOLDER"}
              </div>
              <p className="mt-4 text-white text-base font-medium">
                {developer.title}
              </p>
            </div>
          ))}

    
      </div>

  </div>

  <DeveloperCard 
  imgSrc="/LandingPage/FakePerson1.jpeg"
  title="Senior React Developer"
  name="Jane Smith" 
  description="Passionate about creating intuitive user experiences with modern web technologies."
/>

    </div>
  );
}
