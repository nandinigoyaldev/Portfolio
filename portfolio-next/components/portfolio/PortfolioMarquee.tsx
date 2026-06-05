export default function PortfolioMarquee() {
  return (
    <div className="bg-brand text-white py-4 overflow-hidden relative z-20 -rotate-1 transform scale-105 origin-left shadow-xl hover:rotate-0 transition-transform duration-500">
      <div className="whitespace-nowrap animate-marquee inline-flex items-center gap-8 font-mono text-lg font-bold uppercase tracking-widest">
        <span>Full Stack Development</span>
        ✦
        <span>Creative Solutions</span>
        ✦
        <span>Design</span>
        ✦
        <span>Strategy</span>
        ✦
        <span>Backend Architecture</span>
        ✦
        <span>Full Stack Development</span>
        ✦
        <span>Creative Solutions</span>
        ✦
        <span>Design</span>
        ✦
        <span>Strategy</span>
        ✦
        <span>Development</span>
        ✦
      </div>
    </div>
  );
}

