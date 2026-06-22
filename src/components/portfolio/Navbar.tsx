"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "tech-stack", label: "Tech" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Wins" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "connect", label: "Connect" },
];

const SCROLL_OFFSET = 120;

function scrollToSection(id: string, reduceMotion: boolean) {
  const section = document.getElementById(id);
  if (!section) return;

  const top = section.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  const currentPath = `${window.location.pathname}${window.location.search}`;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: reduceMotion ? "auto" : "smooth",
  });
  window.history.replaceState(null, "", id === "hero" ? currentPath : `#${id}`);
}

export default function Navbar() {
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("hero");
  const [isInHero, setIsInHero] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isNearTop = currentScrollY < 24;

      setIsVisible(isNearTop || isScrollingUp);
      lastScrollY = Math.max(currentScrollY, 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInHero(entry.isIntersecting),
      {
        rootMargin: "-12% 0px -70% 0px",
        threshold: 0,
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-38% 0px -48% 0px",
        threshold: [0.08, 0.18, 0.32, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsPaletteOpen((open) => !open);
      }

      if (event.key === "Escape") {
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigateTo = (id: string) => {
    setActiveSection(id);
    setIsPaletteOpen(false);
    scrollToSection(id, Boolean(reduceMotion));
  };

  return (
    <>
      <motion.nav
        aria-label="Primary"
        className="fixed left-0 right-0 top-4 z-40 pointer-events-none px-3 sm:top-5"
        initial={false}
        animate={{
          y: isVisible ? 0 : -96,
          opacity: isVisible ? 1 : 0,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 30, mass: 0.8 }
        }
      >
        <motion.div
          className={
            "pointer-events-auto mx-auto flex h-12 w-fit max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full px-2.5 text-sm " +
            "transition-colors " +
            "text-white"
          }
          animate={{
            backgroundColor: isInHero ? "rgba(8, 13, 24, 0)" : "rgba(8, 13, 24, 0.62)",
            borderColor: isInHero ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.14)",
            boxShadow: isInHero
              ? "0 0 0 rgba(0, 0, 0, 0)"
              : "0 20px 60px rgba(0, 0, 0, 0.22), 0 0 32px rgba(34, 211, 238, 0.12)",
            backdropFilter: isInHero ? "blur(0px)" : "blur(18px)",
          }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
          style={{ borderWidth: 1, borderStyle: "solid" }}
        >
          <button
            type="button"
            onClick={() => navigateTo("hero")}
            className={
              "group mr-1 flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-left outline-none transition " +
              (isInHero
                ? "hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-200/70"
                : "hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-200/70")
            }
            aria-label="Go to hero"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-[13px] font-semibold tracking-tight">Nandini</span>
              <span className="block text-[10px] text-white/58">Available</span>
            </span>
          </button>

          <div className="hidden items-center gap-0.5 lg:flex" role="list">
            {navItems.slice(1).map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={
                    "relative h-9 rounded-full px-3.5 text-xs font-medium outline-none transition " +
                    (isInHero
                      ? "text-white/72 hover:text-white focus-visible:text-white"
                      : "text-white/68 hover:text-white focus-visible:text-white")
                  }
                  aria-current={isActive ? "page" : undefined}
                  role="listitem"
                >
                  {isActive ? (
                    <motion.span
                      className={
                        "absolute inset-0 rounded-full " +
                        (isInHero
                          ? "bg-white/10 shadow-[0_0_20px_rgba(34,211,238,0.14)]"
                          : "bg-white/12 shadow-[0_0_22px_rgba(34,211,238,0.18)]")
                      }
                      layoutId="nav-active-pill"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                    />
                  ) : null}
                  <motion.span
                    className="relative z-10 block"
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                    transition={{ duration: 0.16 }}
                  >
                    {item.label}
                  </motion.span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            className={
              "ml-1 flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[11px] " +
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition " +
              (isInHero
                ? "border-white/12 bg-white/[0.06] text-white/72 hover:border-cyan-200/35 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-200/70"
                : "border-white/12 bg-white/[0.06] text-white/72 hover:border-cyan-200/35 hover:text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.16)] focus-visible:ring-2 focus-visible:ring-cyan-200/70")
            }
            aria-label="Open command palette"
            aria-expanded={isPaletteOpen}
          >
            <span className="text-white/52">⌘</span>K
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('toggle-theme'))}
            className={
              "ml-1 flex h-9 shrink-0 items-center justify-center w-9 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition " +
              (isInHero
                ? "border-white/12 bg-white/[0.06] text-white/72 hover:border-green-400/35 hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-400/70"
                : "border-white/12 bg-white/[0.06] text-white/72 hover:border-green-400/35 hover:text-green-400 hover:shadow-[0_0_18px_rgba(74,222,128,0.16)] focus-visible:ring-2 focus-visible:ring-green-400/70")
            }
            aria-label="Toggle Hacker Theme"
            title="Toggle Hacker Theme"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {isPaletteOpen ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-start px-4 pt-24 sm:pt-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.16 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onMouseDown={() => setIsPaletteOpen(false)}
          >
            <div className="absolute inset-0 bg-black/28 backdrop-blur-[2px]" />
            <motion.div
              className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/12 bg-[#080d18]/86 p-2 text-white shadow-2xl shadow-black/35 backdrop-blur-2xl"
              initial={reduceMotion ? false : { y: -12, scale: 0.98 }}
              animate={reduceMotion ? undefined : { y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-white/54">Jump to section</div>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={
                      "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm outline-none transition " +
                      "hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-200/70"
                    }
                  >
                    <span>{item.label}</span>
                    {activeSection === item.id ? (
                      <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]" />
                    ) : null}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
