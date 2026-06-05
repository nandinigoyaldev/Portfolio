"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as React from "react";

type Milestone = {
  title: string;
  status: "Completed" | "Active" | "Planned";
  eyebrow: string;
  description: string;
  side: "left" | "right";
  details?: string[];
};

const milestones: Milestone[] = [
  {
    title: "Master Diploma in Computer Engineering",
    status: "Completed",
    eyebrow: "Foundation Signal",
    description:
      "Completed a technical diploma path focused on computer engineering fundamentals, practical systems thinking, and applied development skills.",
    side: "left",
  },
  {
    title: "Bachelor of Computer Applications (BCA)",
    status: "Active",
    eyebrow: "Current Academic Core",
    description:
      "Currently building the academic backbone for software engineering, computer applications, and structured problem solving.",
    side: "right",
  },
  {
    title: "Master of Computer Applications (MCA)",
    status: "Planned",
    eyebrow: "Destination Node",
    description:
      "The next academic jump: a focused postgraduate path designed to deepen computer science, engineering, and product-building depth.",
    side: "left",
    details: ["Target Admission: 2027", "Through NIMCET / CUET PG"],
  },
];

const statusStyles = {
  Completed: {
    node: "bg-cyan-300 shadow-[0_0_26px_rgba(103,232,249,0.9)]",
    ring: "border-cyan-200/40",
    text: "text-cyan-200",
  },
  Active: {
    node: "bg-emerald-300 shadow-[0_0_40px_rgba(110,231,183,0.95)]",
    ring: "border-emerald-200/70",
    text: "text-emerald-200",
  },
  Planned: {
    node: "border-2 border-fuchsia-200 bg-transparent shadow-[0_0_34px_rgba(217,70,239,0.65)]",
    ring: "border-fuchsia-200/55",
    text: "text-fuchsia-200",
  },
};

export default function Education() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 72%", "end 44%"],
  });
  const pathScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#070b14] px-6 py-24 text-white"
      id="education"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.055)_1px,_transparent_1px)] [background-size:28px_28px] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="font-mono text-sm font-medium tracking-[0.35em] text-cyan-200/80">
            NEURAL ACADEMICS
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Learning Pathway
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
            A focused academic journey moving from technical foundation to active undergraduate depth, then toward MCA as the next destination.
          </p>
        </div>

        <div className="relative">
          <div className="absolute bottom-16 left-5 top-8 w-px overflow-hidden rounded-full bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="h-full origin-top rounded-full bg-gradient-to-b from-cyan-300 via-emerald-300 to-fuchsia-300 shadow-[0_0_26px_rgba(103,232,249,0.65)]"
              style={{ scaleY: reduceMotion ? 1 : pathScale }}
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <MilestoneRow
                key={milestone.title}
                milestone={milestone}
                index={index}
                isHovered={hoveredIndex === index}
                reduceMotion={Boolean(reduceMotion)}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MilestoneRow({
  milestone,
  index,
  isHovered,
  reduceMotion,
  onHoverStart,
  onHoverEnd,
}: {
  milestone: Milestone;
  index: number;
  isHovered: boolean;
  reduceMotion: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const isLeft = milestone.side === "left";
  const isActive = milestone.status === "Active";
  const isPlanned = milestone.status === "Planned";
  const styles = statusStyles[milestone.status];

  return (
    <motion.div
      className="group relative grid gap-5 pl-14 md:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] md:items-center md:gap-0 md:pl-0"
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.58, delay: index * 0.08, ease: "easeOut" }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocusCapture={onHoverStart}
      onBlurCapture={onHoverEnd}
    >
      <div className={isLeft ? "md:col-start-1" : "md:col-start-3"}>
        <motion.article
          tabIndex={0}
          className={
            "relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 outline-none backdrop-blur-2xl " +
            "shadow-[0_22px_70px_rgba(0,0,0,0.22)] transition-colors focus-visible:ring-2 focus-visible:ring-cyan-200/70 " +
            (isHovered ? "border-cyan-200/35 bg-white/[0.075]" : "")
          }
          whileHover={reduceMotion ? undefined : { y: -6, scale: 1.012 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_45%)] opacity-80" />
          {isPlanned ? (
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-fuchsia-200/20 bg-fuchsia-400/10 blur-2xl" />
          ) : null}

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold ${styles.text}`}>
                {milestone.status}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/38">
                {milestone.eyebrow}
              </span>
            </div>

            <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {milestone.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/62">{milestone.description}</p>

            {milestone.details ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {milestone.details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.06] px-4 py-3 text-sm text-fuchsia-50"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </motion.article>
      </div>

      <div className="absolute left-5 top-8 z-10 -translate-x-1/2 md:static md:col-start-2 md:flex md:translate-x-0 md:items-center md:justify-center">
        <motion.div
          className={`relative grid rounded-full border ${styles.ring} ${isActive ? "h-20 w-20" : "h-16 w-16"} place-items-center bg-[#070b14]`}
          initial={reduceMotion ? false : { scale: 0.72, opacity: 0.3 }}
          whileInView={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.12 + index * 0.08 }}
        >
          <span
            className={`absolute inset-0 rounded-full border ${styles.ring} ${
              isPlanned ? "animate-ping opacity-50 motion-reduce:animate-none" : "opacity-30"
            }`}
          />
          <span className={`relative rounded-full ${isActive ? "h-8 w-8" : "h-5 w-5"} ${styles.node}`} />
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute left-5 top-14 h-px w-10 origin-left bg-gradient-to-r from-cyan-200 to-transparent md:hidden"
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 0.55 }}
        animate={{ opacity: isHovered ? 1 : 0.55 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.16 + index * 0.08, ease: "easeOut" }}
      />

      <motion.div
        className={
          "pointer-events-none absolute top-14 hidden h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent md:block " +
          (isLeft ? "left-[calc(50%_-_19rem)] right-1/2" : "left-1/2 right-[calc(50%_-_19rem)]")
        }
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 0.5 }}
        animate={{ opacity: isHovered ? 1 : 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.18 + index * 0.08, ease: "easeOut" }}
        style={{ originX: isLeft ? 1 : 0 }}
      />
    </motion.div>
  );
}
