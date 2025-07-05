import React from "react";
import Navbar from "../(site)/Navbar";
import { Card } from "@/components/ui/card";
import DeveloperCard from "@/components/DeveloperCard";
import { Developer } from "../classes/Developer";

export default function AboutPage() {
  const developers = [
    {
      name: "Samuel Koh",
      title: "Lead Software Engineer",
      image: "/LandingPage/FakePerson1.jpeg",
    },
    {
      name: "Koh Chin Teck",
      title: "Front-end Web Developer",
      image: "/LandingPage/FakePerson2.jpeg",
    },
    {
      name: "Ong Xin Yin",
      title: "Backend Engineer - Telegram Bot Services",
      image: "/LandingPage/FakePerson3.jpeg",
    },
    {
      name: "Xu Jia Wei",
      title: "Backend Engineer - Telegram Bot Services",
      image: "/LandingPage/FakePerson1.jpeg",
    },
    {
      name: "John Wong",
      title: "Software Engineer",
      image: "/LandingPage/FakePerson1.jpeg",
    },
    {
      name: "Cheryl Neo",
      title: "User Interface/User Experience Designer",
      image: "/LandingPage/FakePerson1.jpeg",
    },
    {
      name: "Ang Wei Liang",
      title: "Software Engineer",
      image: "/LandingPage/FakePerson1.jpeg",
    },
    // new Developer("Samuel Koh", "Lead Software Engineer", "/LandingPage/FakePerson1.jpeg"),
    // new Developer("Koh Chin Teck", "Front-end Web Developer", "/LandingPage/FakePerson2.jpeg"),
    // new Developer("Ong Xin Yin", "Backend Engineer - Telegram Bot Services", "/LandingPage/FakePerson3.jpeg"),
    // new Developer("Xu Jia Wei", "Backend Engineer - Telegram Bot Services", "/LandingPage/FakePerson1.jpeg"),
    // new Developer("John Wong", "Software Engineer", "/LandingPage/FakePerson1.jpeg"),
    // new Developer("Cheryl Neo", "User Interface/User Experience Designer", "/LandingPage/FakePerson1.jpeg"),
    // new Developer("Ang Wei Liang", "Software Engineer", "/LandingPage/FakePerson1.jpeg"),
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
              years of experience. I provide assistance & guidance to clients
              who face difficult situations to solve their personal problems &
              life issues. <br /> <br />I am also an experienced Energy Healer
              in Quantum Touch & Pranic Healing.
              <br /> <br />
              My mission is to help individuals achieve greater self-awareness,
              personal growth, and spiritual enlightenment through the
              transformative power of Tarot readings and energy healing.
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
              <DeveloperCard
                developer={{
                  imgSrc: developer.image,
                  title: developer.title,
                  name: developer.name,
                }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
