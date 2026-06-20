"use client";

import { motion } from "framer-motion";
import * as React from "react";

export default function Contact() {
  return (
    <section className="relative bg-[#050505] px-6 py-32 md:py-48 text-white min-h-[100dvh] flex flex-col justify-center snap-center" id="connect">

      <div className="mx-auto w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Typographic & Conversational */}
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-white mb-8 leading-[1.1]">
              Let&apos;s build<br />
              <span className="text-white/40">something together.</span>
            </h2>

            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-16 max-w-md">
              Whether you have a project in mind, want to discuss an opportunity, or just want to say hi—my inbox is always open.
            </p>

            <div className="flex flex-wrap gap-8 text-sm font-medium mt-auto">
              <a href="https://github.com/goyaljiiiiii" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors pb-1 border-b border-white/10 hover:border-white">
                GitHub <span className="text-white/30 font-serif">↗</span>
              </a>
              <a href="https://linkedin.com/in/goyaljiiiiii" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors pb-1 border-b border-white/10 hover:border-white">
                LinkedIn <span className="text-white/30 font-serif">↗</span>
              </a>
              <a href="https://youtube.com/@self_taught_bob" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors pb-1 border-b border-white/10 hover:border-white">
                YouTube <span className="text-white/30 font-serif">↗</span>
              </a>
              <a href="/assets/Nandini.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors pb-1 border-b border-white/10 hover:border-white">
                Resume <span className="text-white/30 font-serif">↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Minimal Form */}
          <div className="flex flex-col bg-white/[0.02] p-8 md:p-12 rounded-[2rem] border border-white/[0.05]">
            <form className="flex flex-col gap-10 font-light" method="post" action="https://formspree.io/f/xlgwbqry">

              <div className="group relative pt-2">
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white outline-none focus:border-white transition-colors placeholder:text-transparent peer text-lg"
                  placeholder="What's your name?"
                  id="contact-name"
                />
                <label htmlFor="contact-name" className="absolute left-0 top-2 text-white/30 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white/60 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/60 cursor-text">
                  What&apos;s your name?
                </label>
              </div>

              <div className="group relative pt-2">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white outline-none focus:border-white transition-colors placeholder:text-transparent peer text-lg"
                  placeholder="How can I reach you?"
                  id="contact-email"
                />
                <label htmlFor="contact-email" className="absolute left-0 top-2 text-white/30 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white/60 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/60 cursor-text">
                  How can I reach you?
                </label>
              </div>

              <div className="flex-1 flex flex-col group relative pt-2 mt-4">
                <textarea
                  name="message"
                  required
                  className="w-full flex-1 min-h-[160px] bg-transparent border-b border-white/10 pb-4 text-white outline-none focus:border-white transition-colors placeholder:text-transparent resize-none peer text-lg"
                  placeholder="What's on your mind?"
                  id="contact-message"
                />
                <label htmlFor="contact-message" className="absolute left-0 top-2 text-white/30 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white/60 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/60 cursor-text">
                  What&apos;s on your mind?
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 bg-white text-black hover:bg-white/90 py-4 px-10 rounded-full transition-all text-sm font-medium w-fit"
              >
                Send Message
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
