import Navbar from "@/app/(site)/Navbar";

export default function MembershipPage() {
  return (
    <div className="relative bg-black/20">
      {/* Background GIF */}
      <img
        src="/LandingPage/LandingBackground.jpg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      />


      <div>
        <Navbar />
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Membership</h1>
        <p className="text-lg text-gray-600">
          Welcome to our membership page! Here you can find information about our membership plans.
        </p>
        {/* Add your membership content here */}
      </div>
    </div>
  );
}