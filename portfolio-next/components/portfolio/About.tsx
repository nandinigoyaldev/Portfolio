export default function About() {
  return (
    <section className="py-24 px-6 relative bg-white" id="about">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
          Beyond The Resume
          <svg
            className="absolute w-full h-3 bottom-0 left-0 text-brand opacity-30"
            preserveAspectRatio="none"
            viewBox="0 0 100 10"
          >
            <path
              d="M0 5 Q 50 10 100 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          I enjoy turning complex ideas into simple, useful experiences. My
          approach is curiosity-first: learn fast, build consistently, and share
          knowledge openly so more students can grow with confidence.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="p-6 bg-brand-light/30 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300 group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
            🎓
          </div>
          <div className="font-bold text-gray-900">Campus Mantri</div>
          <div className="text-sm text-gray-500">GeeksforGeeks</div>
        </div>

        <div className="p-6 bg-purple-50 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300 group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
            📘
          </div>
          <div className="font-bold text-gray-900">BCA Student</div>
          <div className="text-sm text-gray-500">IGNOU</div>
        </div>

        <div className="p-6 bg-blue-50 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300 group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
            🎤
          </div>
          <div className="font-bold text-gray-900">Host and Manager</div>
          <div className="text-sm text-gray-500">OSCG</div>
        </div>

        <div className="p-6 bg-yellow-50 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300 group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
            🌍
          </div>
          <div className="font-bold text-gray-900">Open Source</div>
          <div className="text-sm text-gray-500">Aperture</div>
        </div>

        <div className="p-6 bg-green-50 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300 group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
            👑
          </div>
          <div className="font-bold text-gray-900">Community Owner</div>
          <div className="text-sm text-gray-500">CDN IGNOU</div>
        </div>
      </div>
    </section>
  );
}

