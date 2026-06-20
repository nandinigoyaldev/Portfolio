"use client";

import { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";

import Skills from "./Skills";
import Education from "./Education";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import ChatWidget from "../chat/ChatWidget";
import AmbientSnake from "./AmbientSnake";
import CometShower from "./CometShower";

export default function PortfolioPage() {
  // Keeps parity with the original HTML behavior:
  // - intersection-reveal for headings/paragraphs
  // - custom cursor + grain + blobs are implemented within components.
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-10");
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    const els = Array.from(
      document.querySelectorAll("section h2, section h3, section p"),
    );
    els.forEach((el) => {
      (el as HTMLElement).classList.add(
        "opacity-0",
        "translate-y-10",
        "transition-all",
        "duration-700",
      );
      observer.observe(el);
    });

    document.body.style.opacity = "1";

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-surface text-gray-800 font-sans overflow-x-hidden selection:bg-brand selection:text-white relative">
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Education />
        <Projects />
        <Contact />
      </main>

      <Footer />
      <AmbientSnake />
      <div className="block md:hidden">
        <CometShower />
      </div>
      <ChatWidget />
    </div>
  );
}
