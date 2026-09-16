"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about/about-section";
import { GateModal } from "@/components/gate-modal";

export default function Home() {
  const [showGateModal, setShowGateModal] = useState(false);

  const handleOpenGate = () => {
    setShowGateModal(true);
  };

  return (
    <>
      <a className="skip-link" href="#signup">
        Skip to sign up
      </a>

      <main className="bg-[#0e0c0a] text-[#e6dcc8] min-h-screen">
        {/* Full-Screen Master 3D Hero Section */}
        <HeroSection onAwakenClick={handleOpenGate} />

        {/* 6-Stage Cinematic Dark Fantasy Story Journey */}
        <AboutSection onAwakenClick={handleOpenGate} />

        {/* Global Gate Modal */}
        <GateModal isOpen={showGateModal} onClose={() => setShowGateModal(false)} />
      </main>
    </>
  );
}
