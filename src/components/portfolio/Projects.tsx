const projects = [
  {
    name: "AutoBotX",
    label: "Award-winning IoT build",
    description:
      "Autonomous IoT system blending hardware control and software execution. It placed 2nd in a National IoT Hackathon and shows Nandini's hardware-software problem solving.",
    stack: ["C++", "Python", "HTML", "IoT"],
    live: "https://github.com/goyaljiiiiii/AutoBotX",
    code: "https://github.com/goyaljiiiiii/AutoBotX",
    highlight: "2nd Place",
  },
  {
    name: "AutoAlign",
    label: "Recognized utility tool",
    description:
      "A developer utility for automated alignment and visual component mapping, recognized on Commudle for its practical, easy-to-use approach.",
    stack: ["TypeScript", "React", "CSS"],
    live: "https://github.com/goyaljiiiiii/AutoAlign",
    code: "https://github.com/goyaljiiiiii/AutoAlign",
    highlight: "Commudle",
  },
  {
    name: "Portfolio Assistant",
    label: "AI-powered portfolio",
    description:
      "This portfolio pairs a responsive Next.js experience with an assistant that can answer questions about projects, education, communities, and resume details.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    live: "https://nandini-goyal.netlify.app/",
    code: "https://github.com/goyaljiiiiii/portfolio",
    highlight: "Live Site",
  },
];

export default function Projects() {
  return (
    <section className="relative overflow-hidden bg-[#070b14] px-6 py-24 text-white" id="projects">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.045)_1px,_transparent_1px)] [background-size:28px_28px] opacity-25" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-sm font-medium tracking-[0.35em] text-emerald-300/80">
              PROJECTS
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">Selected Work</h2>
          </div>
          <a
            href="/assets/Nandini.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded border border-white/15 bg-white/[0.06] px-4 py-2 font-mono text-xs uppercase tracking-widest text-white/70 transition hover:border-emerald-300/40 hover:text-white"
          >
            Resume
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="group flex min-h-[360px] flex-col rounded-lg border border-white/10 bg-[#0a0f1a]/86 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-emerald-300/35 hover:bg-[#0d1422]"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/70">
                    {project.label}
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-white">{project.name}</h3>
                </div>
                <span className="rounded border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-200">
                  {project.highlight}
                </span>
              </div>

              <p className="text-sm leading-7 text-white/62">{project.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex gap-3 pt-8 font-mono text-xs uppercase tracking-widest">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-200 transition hover:text-white"
                >
                  Live
                </a>
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 transition hover:text-white"
                >
                  Code
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
