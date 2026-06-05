"use client";

import { motion, useReducedMotion } from "framer-motion";

type Channel = {
  key: "github" | "linkedin" | "email" | "resume";
  label: string;
  description: string;
  href: string;
};

const channels: Channel[] = [
  {
    key: "github",
    label: "GitHub",
    description: "Explore repositories, experiments, and open-source work.",
    href: "https://github.com/goyaljiiiiii",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    description: "Connect for collaborations, roles, and professional updates.",
    href: "https://linkedin.com/in/goyaljiiiiii",
  },
  {
    key: "email",
    label: "Email",
    description: "Send a direct note for projects, mentorship, or opportunities.",
    href: "mailto:nandini@example.com",
  },
  {
    key: "resume",
    label: "Resume",
    description: "Download the latest profile and experience snapshot.",
    href: "/assets/Nandini.pdf",
  },
];

function ChannelIcon({ name }: { name: Channel["key"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M9 19c-4 1.5-4-2-5-2m10 4v-3.5c0-1 .1-1.4-.5-2 2-.2 4-.9 4-4.5 0-1-.3-2-1-2.7.1-.3.4-1.3-.1-2.7 0 0-1-.3-3 .9-.9-.2-1.9-.2-2.8 0-2-1.2-3-.9-3-.9-.5 1.4-.2 2.4-.1 2.7-.7.7-1 1.7-1 2.7 0 3.6 2 4.3 4 4.5-.3.3-.5.7-.5 1.5V21"
            {...common}
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2" {...common} />
          <path d="M2 9h4v12H2z" {...common} />
          <path d="M4 4a2 2 0 1 0 0.01 0" {...common} />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M4 4h16v16H4z" {...common} />
          <path d="m4 6 8 7 8-7" {...common} />
        </svg>
      );
    case "resume":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...common} />
          <path d="M14 2v6h6" {...common} />
          <path d="M8 13h8" {...common} />
          <path d="M8 17h6" {...common} />
        </svg>
      );
  }
}

export default function Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#070b14] px-6 py-24 text-white" id="connect">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-12 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:44px_44px] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-sm font-medium tracking-[0.35em] text-cyan-200/80">
              COMMUNICATION HUB
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Choose a Channel</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
              Open the route that fits the signal: code, career, direct mail, or a quick resume scan.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/[0.07] px-4 py-2 text-sm text-emerald-100 shadow-[0_0_28px_rgba(110,231,183,0.12)] backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </span>
            Available for opportunities
          </div>
        </div>

        <div className="relative mb-16">
          <motion.div
            className="pointer-events-none absolute left-6 right-6 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent lg:block"
            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, index) => (
              <motion.a
                key={channel.key}
                href={channel.href}
                target={channel.key === "email" ? undefined : "_blank"}
                rel={channel.key === "email" ? undefined : "noopener noreferrer"}
                className={
                  "group relative min-h-[190px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5 " +
                  "outline-none backdrop-blur-2xl transition-colors hover:border-cyan-200/35 hover:bg-white/[0.075] " +
                  "focus-visible:ring-2 focus-visible:ring-cyan-200/70"
                }
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_48%)] opacity-70 transition-opacity group-hover:opacity-100" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl transition-opacity group-hover:opacity-100" />

                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-6 grid h-12 w-12 place-items-center rounded-full border border-cyan-200/18 bg-cyan-300/[0.08] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.16)] transition group-hover:scale-105 group-hover:shadow-[0_0_34px_rgba(34,211,238,0.25)]">
                      <ChannelIcon name={channel.key} />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-white">{channel.label}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/58">{channel.description}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-cyan-100/70">
                    Open channel
                    <span className="h-px w-8 bg-cyan-200/40 transition-all group-hover:w-12 group-hover:bg-cyan-200" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:p-8 lg:grid-cols-[0.82fr_1.18fr]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070b14]/70 p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_50%)]" />
            <div className="relative">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-cyan-200/70">
                Direct Message
              </span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight">Open a Signal</h3>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Drop the essentials and the message routes through the contact endpoint. Short, clear signals get the fastest response.
              </p>
              <div className="mt-8 space-y-3 text-sm text-white/58">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
                  Project collaboration
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
                  Roles and opportunities
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-300 shadow-[0_0_14px_rgba(165,180,252,0.9)]" />
                  Mentorship or community work
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-4" method="post" action="/api/contact" aria-label="Direct message form">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/48">Name</span>
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-200/15"
                  type="text"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/48">Email</span>
                <input
                  name="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-200/15"
                  type="email"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/48">Message</span>
              <textarea
                name="message"
                required
                className="mt-2 min-h-[150px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-200/15"
                placeholder="Transmit your message..."
              />
            </label>

            <motion.button
              type="submit"
              className="w-full rounded-full border border-cyan-200/24 bg-cyan-300/12 px-5 py-3 font-medium text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.12)] outline-none transition hover:border-cyan-200/45 hover:bg-cyan-300/18 focus-visible:ring-2 focus-visible:ring-cyan-200/70"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
