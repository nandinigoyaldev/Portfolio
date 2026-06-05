"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import CursorAndEffects from "./CursorAndEffects";

const orbitTech = ["React", "Next.js", "Python", "OpenCV", "GitHub"];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 18, y: y * -18 });
  };

  const scrollToNext = () => {
    const section = document.getElementById("tech-stack");
    if (!section) return;

    window.scrollTo({
      top: Math.max(section.getBoundingClientRect().top + window.scrollY - 120, 0),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <>
      <CursorAndEffects />

      <section
        id="hero"
        className="relative min-h-screen overflow-hidden bg-[#070b14] px-6 pb-20 pt-24 text-white"
        aria-label="Hero"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-400/14 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/12 blur-3xl" />
          <div className="absolute left-0 top-1/3 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:30px_30px] opacity-30" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-14 lg:gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:-translate-y-10 py-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/18 bg-emerald-300/[0.07] px-4 py-2 text-sm text-emerald-100 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              Open source, community, and real projects
            </div>

            <h1 className="max-w-4xl text-lg font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
              Building software, communities, and a path forward.
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/72">
              I&apos;m Nandini, a BCA and MDCE student growing in public through open source,
              CDN IGNOU, mentoring, and projects that start small but teach something real.
            </p>

            <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-white/54">
              My work sits between code and community: contributing, hosting, teaching,
              documenting, and building the kind of opportunities I once had to search for.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                className="rounded-full border border-cyan-200/24 bg-cyan-300/12 px-6 py-3 font-medium text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.12)] transition hover:border-cyan-200/45 hover:bg-cyan-300/18"
                href="/assets/Nandini.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
              <a
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 font-medium text-white/78 transition hover:border-emerald-200/35 hover:text-white"
                href="#connect"
              >
                Connect
              </a>
              <a
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 font-medium text-white/78 transition hover:border-fuchsia-200/35 hover:text-white"
                href="https://github.com/goyaljiiiiii"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </motion.div>

          <div className="relative mx-auto lg:mr-0 lg:ml-auto lg:translate-x-8 lg:translate-y-6 h-[320px] w-full max-w-[340px] sm:h-[420px]">
            <motion.div
              className="absolute inset-0"
              animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/12 sm:h-[350px] sm:w-[350px]" />
              <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-200/12 sm:h-[260px] sm:w-[260px]" />

              {orbitTech.map((tech, index) => {
                const angle = (index / orbitTech.length) * 360;

                return (
                  <motion.div
                    key={tech}
                    className="absolute left-1/2 top-1/2 -ml-12 -mt-5 grid h-10 w-24 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-xs text-white/78 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-xl"
                    style={{
                      transform: `rotate(${angle}deg) translateX(145px) rotate(${-angle}deg)`,
                    }}
                    animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 3.4, delay: index * 0.24, repeat: Infinity }}
                  >
                    {tech}
                  </motion.div>
                );
              })}

              {[0, 1, 2, 3, 4, 5].map((particle) => (
                <motion.span
                  key={particle}
                  className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200/80 shadow-[0_0_14px_rgba(103,232,249,0.9)]"
                  style={{
                    left: `${18 + particle * 13}%`,
                    top: `${18 + (particle % 3) * 24}%`,
                  }}
                  animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 3.6 + particle * 0.35, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-1/2 z-10 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-white/12 bg-white/[0.06] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-2xl sm:h-[270px] sm:w-[270px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
              style={{
                transform: `translate(-50%, -50%) perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_48%)]" />
              <div className="relative h-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#101827]">
                <Image
                  alt="Nandini"
                  src="/assets/picture.jpeg"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/50 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        <button
          className="absolute bottom-8 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/62 backdrop-blur-xl transition hover:border-cyan-200/35 hover:text-white"
          type="button"
          aria-label="Scroll to tech stack"
          onClick={scrollToNext}
        >
          ↓
        </button>
      </section>
    </>
  );
}
