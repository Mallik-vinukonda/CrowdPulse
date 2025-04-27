import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header Section */}
      <header className="px-6 py-16 text-center bg-white/80 shadow-md rounded-b-3xl relative overflow-hidden">
            <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 tracking-tight drop-shadow font-montserrat">
          CrowdPulse
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-blue-700 font-inter max-w-2xl mx-auto">
          Empowering citizens to report issues, earn rewards, and build better communities—together.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition">
            Get Started
          </Link>
          <Link to="/login" className="border-2 border-blue-600 text-blue-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition">
            Login
          </Link>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-100 rounded-full blur-2xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse-slower"></div>
        </div>
      </header>
      {/* Main Section */}
      <main className="flex-1 px-6 py-10 flex flex-col-reverse md:flex-row items-center justify-center gap-16">
        {/* Left - Features */}
        <div className="max-w-xl space-y-8 font-inter">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
          <ul className="space-y-5 text-blue-900 text-lg">
            {[
              "Spot an issue? Report it instantly with photo & details.",
              "Earn credits for accepted reports—redeem for rewards!",
              "Access premium resources and level up your skills.",
              "Moderators review and help resolve issues fast.",
              "Track your impact and grow your reputation."
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="text-blue-700 text-base mt-4">
            Safe, transparent, and community-driven. <strong>Be the change you want to see!</strong>
          </p>
        </div>
        {/* Right - Hero Image */}
        <div className="flex-1 flex justify-center items-center">
          <img src="/hero-crowdpulse.svg" alt="CrowdPulse Hero" className="w-80 md:w-[28rem] rounded-3xl shadow-2xl border-4 border-blue-200 animate-fade-in" />
        </div>
      </main>
      {/* Footer */}
      <footer className="text-center text-blue-700 text-sm font-inter py-6">
        &copy; {new Date().getFullYear()} CrowdPulse. Built for urban changemakers.
      </footer>
    </div>
  );
}
