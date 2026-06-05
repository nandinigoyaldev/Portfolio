export default function Projects() {
  return (
    <section className="py-24 px-6 bg-surface relative" id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-brand font-mono font-medium tracking-wide">
              PROJECTS
            </span>
            <h2 className="text-4xl font-bold mt-2">Selected Work</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Project 1</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Placeholder. Migrate your existing Projects markup here.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Project 2</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Placeholder. Migrate your existing Projects markup here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

