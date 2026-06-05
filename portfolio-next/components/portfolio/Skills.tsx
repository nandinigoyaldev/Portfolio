"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

type Tech = {
  name: string;
  icon: string;
};

type TechGroup = {
  category: string;
  accent: string;
  items: Tech[];
};

const techGroups: TechGroup[] = [
  {
    category: "Frontend",
    accent: "cyan",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind", icon: "tailwindcss" },
    ],
  },
  {
    category: "Backend",
    accent: "emerald",
    items: [
      { name: "Python", icon: "python" },
      { name: "Flask", icon: "flask" },
      { name: "Node.js", icon: "nodedotjs" },
      { name: "REST APIs", icon: "fastapi" },
    ],
  },
  {
    category: "Tools",
    accent: "indigo",
    items: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Postman", icon: "postman" },
      { name: "SQL", icon: "postgresql" },
    ],
  },
  {
    category: "AI & Computer Vision",
    accent: "fuchsia",
    items: [
      { name: "OpenCV", icon: "opencv" },
      { name: "MediaPipe", icon: "google" },
    ],
  },
];

const experiences = [
  {
    title: "Founder & Technical Lead",
    org: "CDN IGNOU",
    tag: "Community",
    signal: "Started and shaped a student community around support, technical learning, and shared opportunity.",
    impact: "Built spaces where IGNOU learners can ask, build, and grow together.",
  },
  {
    title: "Open Source Project Admin",
    org: "SSOC / GSSOC / Apertre",
    tag: "Open Source",
    signal: "Helped contributors find direction, understand projects, and move from confusion to contribution.",
    impact: "Project guidance, contribution reviews, and community support.",
  },
  {
    title: "Content Creator & Mentor",
    org: "Self Taught Bob",
    tag: "Mentorship",
    signal: "Turned self-learning into public notes, guidance, and beginner-friendly technical content.",
    impact: "Mentoring through practical explanations and visible learning.",
  },
  {
    title: "Campus Ambassador",
    org: "GeeksforGeeks",
    tag: "Campus",
    signal: "Connected students with coding culture, learning resources, and technical events.",
    impact: "Helped learning feel more reachable on campus.",
  },
  {
    title: "Campus Ambassador Program Manager Lead",
    org: "Work2Hire",
    tag: "Leadership",
    signal: "Managed student ambassador workflows, coordination, and outreach systems.",
    impact: "Led people, deadlines, and communication loops.",
  },
  {
    title: "Host & Management Lead",
    org: "Open Source Connect",
    tag: "Events",
    signal: "Hosted and managed sessions where developers, students, and contributors could meet and learn.",
    impact: "Event flow, speaker coordination, and community energy.",
  },
  {
    title: "Sales Development Representative",
    org: "algoacquisition",
    tag: "Business",
    signal: "Worked on outreach, conversations, qualification, and the human side of growth.",
    impact: "Sharper communication and practical business context.",
  },
];

const achievements = [
  {
    title: "2nd Place IoT Hackathon",
    detail: "AutoBotX placed second, a hands-on build that blended hardware thinking with software execution.",
  },
  {
    title: "Top 25 Apertre Contributor",
    detail: "Recognized among the top contributors in Apertre 3.0.",
  },
  {
    title: "AutoAlign Recognition",
    detail: "AutoAlign received recognition on Commudle.",
  },
  {
    title: "Technical Event Organization",
    detail: "Organized hackathons, workshops, and HackDay-style sessions for student builders.",
  },
  {
    title: "Open Source Contributions",
    detail: "Contributed across multiple projects while learning in public.",
  },
];

const accentClasses: Record<string, string> = {
  cyan: "border-cyan-200/25 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]",
  emerald: "border-emerald-200/25 text-emerald-100 shadow-[0_0_28px_rgba(110,231,183,0.16)]",
  indigo: "border-indigo-200/25 text-indigo-100 shadow-[0_0_28px_rgba(129,140,248,0.16)]",
  fuchsia: "border-fuchsia-200/25 text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.16)]",
};

export default function Skills() {
  return (
    <>
      <TechStackSection />
      <ExperienceSection />
      <AchievementsSection />
    </>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#070b14] px-6 py-24 text-white" id={id}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.052)_1px,_transparent_1px)] [background-size:30px_30px] opacity-25" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <span className="font-mono text-sm font-medium tracking-[0.35em] text-cyan-200/80">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">{intro}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function TechStackSection() {
  const reduceMotion = useReducedMotion();
  const [activeTech, setActiveTech] = React.useState<string | null>(null);

  return (
    <SectionShell
      id="tech-stack"
      eyebrow="TECH STACK"
      title="Tools I Actually Reach For"
      intro="The stack I use when an idea needs to become a working thing."
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:p-8">
        <motion.div
          className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent lg:block"
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <div className="grid gap-5 lg:grid-cols-4">
          {techGroups.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070b14]/76 p-5"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.08, ease: "easeOut" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_48%)]" />
              <div className="relative">
                <h3 className="mb-5 text-lg font-semibold">{group.category}</h3>

                <div className="grid grid-cols-2 gap-3">
                  {group.items.map((item, itemIndex) => {
                    const isActive = activeTech === item.name;

                    return (
                      <motion.button
                        key={item.name}
                        type="button"
                        onMouseEnter={() => setActiveTech(item.name)}
                        onMouseLeave={() => setActiveTech(null)}
                        onFocus={() => setActiveTech(item.name)}
                        onBlur={() => setActiveTech(null)}
                        className={
                          "group/node relative grid min-h-24 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-center outline-none transition " +
                          "hover:border-cyan-200/35 hover:bg-white/[0.075] focus-visible:ring-2 focus-visible:ring-cyan-200/70"
                        }
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.35, delay: groupIndex * 0.08 + itemIndex * 0.04 }}
                        whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
                      >
                        {isActive ? (
                          <motion.span
                            layoutId="tech-node-active"
                            className="absolute inset-0 rounded-2xl bg-cyan-300/12 shadow-[0_0_28px_rgba(34,211,238,0.22)]"
                          />
                        ) : null}
                        <span className={`relative mb-2 grid h-11 w-11 place-items-center rounded-full border bg-white/[0.04] ${accentClasses[group.accent]}`}>
                          <img
                            alt=""
                            className="h-6 w-6"
                            src={`https://cdn.simpleicons.org/${item.icon}/ffffff`}
                          />
                        </span>
                        <span className="relative text-sm text-white/76 group-hover/node:text-white">
                          {item.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function ExperienceSection() {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <SectionShell
      id="experience"
      eyebrow="EXPERIENCE & LEADERSHIP"
      title="Where I Show Up"
      intro="Communities, open source, events, content, and the work of helping people move."
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-3">
          {experiences.map((experience, index) => {
            const isOpen = openIndex === index;
            const isPriority = ["CDN IGNOU", "SSOC / GSSOC / Apertre", "GeeksforGeeks", "Work2Hire", "Open Source Connect", "Self Taught Bob"].includes(experience.org);

            return (
              <motion.button
                key={`${experience.title}-${experience.org}`}
                type="button"
                onClick={() => setOpenIndex(index)}
                className={
                  "relative w-full rounded-[1.25rem] border p-4 text-left outline-none backdrop-blur-2xl transition " +
                  (isOpen
                    ? "border-cyan-200/35 bg-white/[0.075] shadow-[0_0_34px_rgba(34,211,238,0.13)]"
                    : "border-white/10 bg-white/[0.045] hover:border-white/18 hover:bg-white/[0.06]")
                }
                initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-cyan-100/58">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {isPriority ? (
                        <span className="rounded-full border border-emerald-200/18 bg-emerald-300/[0.07] px-2 py-0.5 text-[11px] text-emerald-100">
                          highlighted
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-white">{experience.org}</h3>
                    <p className="mt-1 text-sm text-white/52">{experience.title}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/50">
                    {experience.tag}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={openIndex}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_45%)]" />
            <div className="relative">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                Active Signal
              </span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight">{experiences[openIndex].org}</h3>
              <p className="mt-2 text-lg text-white/68">{experiences[openIndex].title}</p>
              <p className="mt-6 text-base leading-8 text-white/68">{experiences[openIndex].signal}</p>
              <div className="mt-6 rounded-2xl border border-cyan-200/12 bg-cyan-300/[0.055] p-4 text-sm leading-7 text-cyan-50">
                {experiences[openIndex].impact}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}

function AchievementsSection() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <SectionShell
      id="achievements"
      eyebrow="ACHIEVEMENTS"
      title="Unlocked Along the Way"
      intro="Small proof points from building, contributing, organizing, and showing up consistently."
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:p-8">
        <motion.div
          className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-fuchsia-200/55 to-transparent md:block"
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <div className="grid gap-4 md:grid-cols-5">
          {achievements.map((achievement, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.article
                key={achievement.title}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className="group relative min-h-[230px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070b14]/76 p-5 outline-none transition hover:border-fuchsia-200/35 focus-visible:ring-2 focus-visible:ring-fuchsia-200/70"
                initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.94 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.48, delay: index * 0.07, ease: "easeOut" }}
                whileHover={reduceMotion ? undefined : { y: -7, scale: 1.018 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.16),_transparent_52%)] opacity-70 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-8 flex items-center justify-between">
                    <motion.span
                      className="grid h-12 w-12 place-items-center rounded-full border border-fuchsia-200/24 bg-fuchsia-300/[0.08] font-mono text-sm text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.16)]"
                      animate={
                        isActive && !reduceMotion
                          ? { boxShadow: "0 0 42px rgba(217,70,239,0.38)", scale: 1.08 }
                          : { boxShadow: "0 0 24px rgba(217,70,239,0.16)", scale: 1 }
                      }
                    >
                      ✓
                    </motion.span>
                    <span className="h-px w-10 bg-fuchsia-200/35 transition-all group-hover:w-14 group-hover:bg-fuchsia-200" />
                  </div>

                  <h3 className="text-lg font-semibold leading-tight text-white">{achievement.title}</h3>
                  <AnimatePresence initial={false}>
                    {(isActive || reduceMotion) ? (
                      <motion.p
                        className="mt-4 text-sm leading-6 text-white/62"
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                      >
                        {achievement.detail}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                  <div className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-fuchsia-100/62">
                    Unlock {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
