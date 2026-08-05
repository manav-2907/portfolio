import { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  Download,
  ArrowRight,
  ArrowUp,
  Terminal,
  Cpu,
  Code2,
  Database,
  Cloud,
  Eye,
  Bot,
  Layers,
  Menu,
  X,
  MapPin,
  Sparkles,
  FileJson,
  Workflow,
  Globe,
} from "lucide-react";

// ─── Contact constants (single source of truth) ───────────────────────────────

const LINKS = {
  github: "https://github.com/manav-2907",
  linkedin: "https://www.linkedin.com/in/manav-narula-ai/",
  email: "mnarula337@gmail.com",
  phone: "+918375980544",
  phoneDisplay: "+91 83759 80544",
  resume: "/Manav_Narula_Resume.pdf",
};

// ─── Utilities ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Animated count-up that fires once when scrolled into view. */
function CountUp({ value, suffix = "", decimals = 0, duration = 1500 }: {
  value: number; suffix?: string; decimals?: number; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(value * eased);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display.toFixed(decimals)}{suffix}</span>;
}

// ─── Scroll progress bar ───────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setPct(Math.min(scrolled * 100, 100));
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#00d4b8] to-[#3b82f6] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Scroll-spy ────────────────────────────────────────────────────────────────

const SECTION_IDS = ["about", "services", "experience", "projects", "skills", "education", "contact"];

function useScrollSpy() {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

// ─── Terminal Typewriter ───────────────────────────────────────────────────────

const TERMINAL_LINES = [
  "> LangGraph agent: plan → execute → synthesize ✓",
  "> Eval suite: matcher accuracy 90% ✓",
  "> Extracting 300+ CAD images/day with GPT-4o...",
  "> Routing queries: RAG ↔ Pandas agent ✓",
  "> FastAPI backend: running on :8000",
  "> JSON ready — 17+ attributes parsed ✓",
];

function TerminalHero() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= TERMINAL_LINES.length) return;
    const target = TERMINAL_LINES[currentLine];
    if (currentChar < target.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines((l) => [...l, target]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar]);

  const partial = currentLine < TERMINAL_LINES.length
    ? TERMINAL_LINES[currentLine].slice(0, currentChar)
    : "";

  return (
    <div className="font-mono text-xs sm:text-sm leading-relaxed text-left max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[#6b7fa3] text-xs">manav@ai-engineer ~ </span>
      </div>
      {lines.map((l, i) => (
        <div key={i} className="text-[#00d4b8]">{l}</div>
      ))}
      {currentLine < TERMINAL_LINES.length && (
        <div className="text-[#00d4b8]">
          {partial}
          <span className="inline-block w-2 h-4 bg-[#00d4b8] ml-0.5 animate-pulse align-middle" />
        </div>
      )}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Services", "Experience", "Projects", "Skills", "Education", "Contact"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scroll = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0f1e]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/30" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-mono text-[#00d4b8] font-medium tracking-tight hover:opacity-80 transition-opacity">
          MN<span className="text-white/40">.</span>
        </button>
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.toLowerCase();
            return (
              <li key={l}>
                <button
                  onClick={() => scroll(l)}
                  className={`text-sm transition-colors duration-200 font-medium relative ${
                    isActive ? "text-[#00d4b8]" : "text-[#6b7fa3] hover:text-[#00d4b8]"
                  }`}
                >
                  {l}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-[#00d4b8]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          className="md:hidden text-[#6b7fa3] hover:text-white transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-[#0d1424]/98 backdrop-blur-md border-b border-white/5 px-6 pb-6 pt-2">
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              onClick={() => scroll(l)}
              className={`block w-full text-left py-3 transition-colors text-sm font-medium border-b border-white/5 last:border-0 ${
                active === l.toLowerCase() ? "text-[#00d4b8]" : "text-[#6b7fa3] hover:text-[#00d4b8]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#00d4b8 1px, transparent 1px), linear-gradient(90deg, #00d4b8 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Mouse-follow glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#00d4b8]/8 blur-[120px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          left: `calc(${mouse.x * 100}% - 250px)`,
          top: `calc(${mouse.y * 100}% - 250px)`,
        }}
      />
      {/* Static glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#3b82f6]/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4b8]/20 bg-[#00d4b8]/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00d4b8] animate-pulse" />
            <span className="font-mono text-xs text-[#00d4b8] tracking-wide">Available for opportunities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
            Manav<br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4b8] via-[#3b82f6] to-[#00d4b8]"
              style={{ backgroundSize: "200% auto", animation: "gradient-shift 6s ease infinite" }}
            >
              Narula
            </span>
          </h1>

          <p className="font-mono text-sm text-[#6b7fa3] mb-6 tracking-wide">
            AI Engineer · Agentic AI · Computer Vision · Backend Systems
          </p>

          <p className="text-[#a0b0cc] text-lg leading-relaxed mb-6 max-w-lg">
            Building AI-powered systems that turn unstructured data into real business value —
            autonomous agents, LLM pipelines, RAG architectures, and production APIs.
          </p>

          <div className="flex items-center gap-2 text-sm text-[#6b7fa3] mb-10">
            <MapPin size={15} className="text-[#00d4b8]" />
            New Delhi, India
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 px-6 py-3 bg-[#00d4b8] text-[#0a0f1e] font-semibold rounded-lg hover:bg-[#00bfa6] transition-all duration-200 text-sm hover:shadow-lg hover:shadow-[#00d4b8]/20"
            >
              View Projects
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <a
              href={LINKS.resume}
              download
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-[#a0b0cc] font-medium rounded-lg hover:border-[#00d4b8]/40 hover:text-white transition-all duration-200 text-sm"
            >
              <Download size={16} />
              Download Resume
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-[#6b7fa3] hover:text-[#00d4b8] hover:border-[#00d4b8]/40 transition-all duration-200">
              <Linkedin size={18} />
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-[#6b7fa3] hover:text-[#00d4b8] hover:border-[#00d4b8]/40 transition-all duration-200">
              <Github size={18} />
            </a>
            <a href={`mailto:${LINKS.email}`} aria-label="Email"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-[#6b7fa3] hover:text-[#00d4b8] hover:border-[#00d4b8]/40 transition-all duration-200">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Right: terminal */}
        <div className="hidden lg:block animate-float-slow">
          <div className="bg-[#0d1424]/80 border border-white/8 rounded-xl p-6 backdrop-blur-sm shadow-2xl shadow-black/40">
            <TerminalHero />
          </div>
          {/* Floating badges */}
          <div className="mt-6 flex flex-wrap gap-3 justify-end">
            {["LangGraph", "GPT-4o", "FastAPI", "RAG", "LangChain"].map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-3 py-1.5 rounded-full bg-[#1a2235] border border-white/8 text-[#6b7fa3]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#6b7fa3] hover:text-[#00d4b8] transition-colors animate-bounce"
        aria-label="Scroll to about"
      >
        <ChevronDown size={24} />
      </button>
    </section>
  );
}

// ─── Tech marquee ──────────────────────────────────────────────────────────────

const MARQUEE_TECH = [
  "LangGraph", "GPT-4o", "LangChain", "FAISS", "FastAPI", "Flask", "OpenCV", "EasyOCR",
  "Gemini Vision", "Pandas", "Scikit-learn", "Docker", "AWS EC2", "Python", "Langfuse",
  "Prompt Engineering", "WhatsApp Cloud API", "Vector Databases", "Streamlit", "SQLite",
];

function Marquee() {
  return (
    <div className="marquee-track relative overflow-hidden border-y border-white/5 bg-[#0d1424] py-5">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0d1424] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0d1424] to-transparent z-10 pointer-events-none" />
      <div className="flex w-max animate-marquee">
        {[...MARQUEE_TECH, ...MARQUEE_TECH].map((t, i) => (
          <span key={i} className="flex items-center gap-3 px-6 font-mono text-sm text-[#6b7fa3] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4b8]/60" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  id, label, title, children, className = "",
}: {
  id: string; label: string; title: string; children: React.ReactNode; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <section id={id} className={`py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-[#00d4b8] tracking-widest uppercase">{label}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00d4b8]/30 to-transparent" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 2, suffix: "+", decimals: 0, label: "Years Experience" },
  { value: 300, suffix: "+", decimals: 0, label: "CAD Images / Day" },
  { value: 17, suffix: "+", decimals: 0, label: "Attributes / Doc" },
  { value: 4, suffix: "+", decimals: 0, label: "Production Systems" },
];

function About() {
  return (
    <Section id="about" label="01 — Who I am" title="About Me" className="bg-[#0d1424]">
      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3 space-y-5 text-[#a0b0cc] leading-relaxed text-base">
          <p>
            I&apos;m an <span className="text-white font-medium">AI Engineer</span> with 2+ years of hands-on
            experience designing and shipping AI-powered systems across Generative AI, Computer Vision, and backend
            engineering. I thrive at the intersection of LLM pipelines and production APIs — turning messy,
            unstructured data into workflows that actually move the needle for businesses.
          </p>
          <p>
            At <span className="text-white font-medium">Billtech Labs</span>, I build{" "}
            <span className="text-[#00d4b8]">multimodal extraction pipelines</span>,{" "}
            <span className="text-[#00d4b8]">RAG + AI agent systems</span>, and WhatsApp-integrated AI products —
            processing 300+ jewellery CAD images daily with GPT-4o into clean, structured JSON.
          </p>
          <p>
            Most recently I built an <span className="text-[#00d4b8]">autonomous AI Career Agent</span> on
            LangGraph — an agent that plans its own multi-step workflow, matches resumes against live job
            listings, and ships with a 90%-accuracy eval suite and Langfuse cost tracing.
          </p>
          <p>
            I care about clean, well-reasoned engineering: choosing the right tool for the job, keeping systems
            observable, and building AI you can measure — not just demo.
          </p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-[#111827] border border-white/8 rounded-xl p-5 text-center hover:border-[#00d4b8]/30 transition-colors duration-300"
            >
              <div className="text-3xl font-bold text-[#00d4b8] mb-1">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-xs text-[#6b7fa3] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Services / What I do ──────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Workflow,
    title: "Agentic AI & RAG Engineering",
    desc: "Autonomous multi-step agents that plan, pick tools, and execute — plus retrieval-augmented pipelines. Built with LangGraph, LangChain, and FAISS, hardened with eval suites and Langfuse observability.",
  },
  {
    icon: FileJson,
    title: "Multimodal Extraction",
    desc: "Turning images, PDFs, and scans into clean structured JSON using GPT-4o Vision, Gemini, EasyOCR, and OpenCV — with confidence scores and validation.",
  },
  {
    icon: Code2,
    title: "Production Backends",
    desc: "FastAPI & Flask services with webhooks, async processing, and error handling — designed to run reliably in production, not just demo in a notebook.",
  },
  {
    icon: Globe,
    title: "Website & Mobile Apps",
    desc: "Modern, responsive websites and mobile applications — from landing pages and portfolios to AI-powered products, with clean UX and API-connected frontends.",
  },
];

function Services() {
  return (
    <Section id="services" label="02 — What I do" title="Services">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="group bg-[#0d1424] border border-white/8 rounded-2xl p-6 hover:border-[#00d4b8]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-[#00d4b8]/10 border border-[#00d4b8]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon size={20} className="text-[#00d4b8]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-[#6b7fa3] text-sm leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

const EXP_BULLETS = [
  "Developed a multimodal AI pipeline to extract structured data from 300+ jewellery CAD images daily using GPT-4o (OCR + semantic parsing), generating JSON with 17+ attributes and automated Excel outputs via Pandas.",
  "Built a FastAPI backend integrated with Meta WhatsApp Webhooks to handle image/document ingestion, perform format conversion, and asynchronously deliver processed outputs (images + text) to users.",
  "Engineered Flask-based REST APIs to integrate with external processing systems using file-based pipelines (inbound/outbound), enabling asynchronous request handling and automated JSON responses.",
  "Developed data management APIs for pricing, labour, and rate configurations using Excel and file-based storage with validation and error handling.",
  "Built an OCR pipeline using EasyOCR and OpenCV to extract text with bounding boxes and confidence scores, generating structured JSON for downstream processing.",
  "Integrated Gemini Vision API for automated background removal and enhancement of jewellery images using prompt-based image transformations.",
];

function Experience() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <Section id="experience" label="03 — Work" title="Experience" className="bg-[#0d1424]">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4b8]/40 via-[#00d4b8]/20 to-transparent hidden sm:block ml-6" />

        <div className="sm:pl-16 space-y-0">
          <div className="flex items-start gap-4 mb-8">
            <div className="hidden sm:flex absolute -left-0 w-12 h-12 rounded-xl bg-[#00d4b8]/10 border border-[#00d4b8]/30 items-center justify-center">
              <Cpu size={18} className="text-[#00d4b8]" />
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <h3 className="text-xl font-bold text-white">AI Engineer</h3>
                <span className="text-[#00d4b8] font-medium">@ Billtech Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#6b7fa3]">Sep 2024 – Present</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4b8] animate-pulse" />
                <span className="font-mono text-xs text-[#00d4b8]">Full-time</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {EXP_BULLETS.map((bullet, i) => (
              <button
                key={i}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                  expanded === i
                    ? "bg-[#111827] border-[#00d4b8]/30"
                    : "bg-[#111827]/40 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#00d4b8] mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className={`text-sm leading-relaxed transition-colors duration-200 ${
                    expanded === i ? "text-white" : "text-[#a0b0cc] group-hover:text-[#c8d5e8]"
                  }`}>
                    {bullet}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: "Autonomous AI Career Agent",
    description:
      "A LangGraph agent that plans its own workflow: resume analysis, skill-gap detection, live job search, resume-vs-JD match scoring, learning roadmaps, and PDF reports. Built like a production system — 90%-accuracy eval suite, Langfuse tracing with per-run cost tracking, cost guardrails, SQLite memory, and a Streamlit UI streaming the agent's decisions live.",
    stack: ["Python", "LangGraph", "OpenAI API", "FastAPI", "Streamlit", "Langfuse"],
    github: "https://github.com/manav-2907/agentic-ai-task-executor",
    demo: null, // add the live URL once deployed
    icon: Workflow,
    accent: "#00d4b8",
  },
  {
    title: "Hybrid RAG + AI Agent System",
    description:
      "An AI application built with LangChain and OpenAI that routes queries between a FAISS vector store (RAG) and a Pandas DataFrame agent based on query intent. Supports multi-format ingestion (PDF, TXT, CSV) with LLM-based document classification for invoices, contracts, and bank statements.",
    stack: ["Python", "LangChain", "OpenAI API", "FAISS", "Pandas Agent"],
    github: "https://github.com/manav-2907/hybrid-rag-agent",
    demo: null, // add your Streamlit Cloud URL here
    icon: Bot,
    accent: "#3b82f6",
  },
  {
    title: "Smart Document Inspector",
    description:
      "A FastAPI backend that uses OpenAI Vision models for document processing — accepting uploaded files, performing intelligent document classification, and returning clean structured JSON output driven by careful prompt engineering.",
    stack: ["Python", "FastAPI", "OpenAI Vision API", "Prompt Engineering"],
    github: "https://github.com/manav-2907/smart-doc-inspector",
    demo: null,
    icon: Eye,
    accent: "#a855f7",
  },
];

function ProjectCard({ project }: { project: (typeof PROJECTS)[0] }) {
  const Icon = project.icon;
  return (
    <div className="group relative bg-[#111827] border border-white/8 rounded-2xl p-6 hover:border-[#00d4b8]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00d4b8]/5 flex flex-col">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${project.accent}15`, border: `1px solid ${project.accent}30` }}
      >
        <Icon size={20} style={{ color: project.accent }} />
      </div>

      <h3 className="text-white font-bold text-lg mb-3 leading-snug">{project.title}</h3>
      <p className="text-[#6b7fa3] text-sm leading-relaxed mb-6 flex-1">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.stack.map((s) => (
          <span key={s} className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#0d1424] border border-white/8 text-[#6b7fa3]">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-[#6b7fa3] hover:text-white transition-colors">
          <Github size={14} />
          GitHub
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[#00d4b8] hover:text-white transition-colors">
            <ExternalLink size={14} />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <Section id="projects" label="04 — Work samples" title="Featured Projects">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg text-sm font-medium text-[#a0b0cc] hover:border-[#00d4b8]/40 hover:text-white transition-all duration-200"
        >
          <Github size={16} />
          View more on GitHub
          <ArrowRight size={14} />
        </a>
      </div>
    </Section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

const SKILL_GROUPS = [
  {
    icon: Bot,
    label: "Generative AI & LLMs",
    tags: ["OpenAI API (GPT-4o / GPT-5)", "Google Gemini API", "Prompt Engineering", "Function Calling", "Structured Outputs"],
  },
  {
    icon: Layers,
    label: "Agentic AI & RAG",
    tags: ["LangGraph", "LangChain", "AI Agents", "Evals", "Langfuse", "FAISS", "Vector Databases", "Query Routing"],
  },
  {
    icon: Eye,
    label: "Computer Vision & OCR",
    tags: ["OpenAI Vision API", "EasyOCR", "OpenCV", "Document AI", "Image Preprocessing"],
  },
  {
    icon: Code2,
    label: "Backend Development",
    tags: ["FastAPI", "Flask", "REST APIs", "Webhooks", "API Integration", "Microservices"],
  },
  {
    icon: Database,
    label: "Machine Learning",
    tags: ["Scikit-learn", "Classification", "Regression", "Feature Engineering", "Model Evaluation", "ML Pipelines"],
  },
  {
    icon: Cloud,
    label: "Tools & Cloud",
    tags: ["AWS EC2", "Git", "Docker", "Linux", "Streamlit", "SQLite", "Postman", "WhatsApp Cloud API", "Pandas"],
  },
];

function Skills() {
  return (
    <Section id="skills" label="05 — Toolkit" title="Skills & Technologies" className="bg-[#0d1424]">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SKILL_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.label}
              className="bg-[#111827] border border-white/5 rounded-xl p-5 hover:border-[#00d4b8]/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#00d4b8]/10 flex items-center justify-center">
                  <Icon size={15} className="text-[#00d4b8]" />
                </div>
                <span className="text-sm font-semibold text-white">{group.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#1a2235] border border-white/8 text-[#6b7fa3] hover:text-[#00d4b8] hover:border-[#00d4b8]/30 transition-colors duration-200 cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function Education() {
  return (
    <Section id="education" label="06 — Academic background" title="Education">
      <div className="max-w-2xl">
        <div className="bg-[#111827] border border-white/8 rounded-2xl p-6 flex items-start gap-5 hover:border-[#00d4b8]/20 transition-colors duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#00d4b8]/10 border border-[#00d4b8]/20 flex items-center justify-center shrink-0">
            <Terminal size={20} className="text-[#00d4b8]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-snug mb-1">
              Bachelor of Computer Applications (BCA)
            </h3>
            <p className="text-[#00d4b8] font-medium text-sm mb-1">
              Guru Gobind Singh Indraprastha University
            </p>
            <p className="text-[#6b7fa3] text-sm">New Delhi, India · 2021 – 2024</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open the user's mail client with a prefilled message (no backend required).
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || "someone"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${LINKS.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Section id="contact" label="07 — Get in touch" title="Contact" className="bg-[#0d1424]">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-[#a0b0cc] leading-relaxed mb-8 text-base">
            I&apos;m actively looking for new opportunities. Whether you want to discuss a project,
            talk about AI, or just say hello — my inbox is open.
          </p>

          <div className="space-y-4">
            <a href={`mailto:${LINKS.email}`}
              className="flex items-center gap-3 text-sm text-[#6b7fa3] hover:text-[#00d4b8] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#1a2235] flex items-center justify-center group-hover:bg-[#00d4b8]/10 transition-colors">
                <Mail size={15} />
              </div>
              {LINKS.email}
            </a>
            <a href={`tel:${LINKS.phone}`}
              className="flex items-center gap-3 text-sm text-[#6b7fa3] hover:text-[#00d4b8] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#1a2235] flex items-center justify-center group-hover:bg-[#00d4b8]/10 transition-colors">
                <Phone size={15} />
              </div>
              {LINKS.phoneDisplay}
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[#6b7fa3] hover:text-[#00d4b8] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#1a2235] flex items-center justify-center group-hover:bg-[#00d4b8]/10 transition-colors">
                <Linkedin size={15} />
              </div>
              linkedin.com/in/manav-narula-ai
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[#6b7fa3] hover:text-[#00d4b8] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#1a2235] flex items-center justify-center group-hover:bg-[#00d4b8]/10 transition-colors">
                <Github size={15} />
              </div>
              github.com/manav-2907
            </a>
          </div>

          <a
            href={LINKS.resume}
            download
            className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-[#00d4b8] text-[#0a0f1e] font-semibold rounded-lg hover:bg-[#00bfa6] transition-colors text-sm"
          >
            <Download size={16} />
            Download Resume
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6b7fa3] mb-2 uppercase tracking-widest">Name</label>
            <input
              required type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full bg-[#111827] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6b] focus:outline-none focus:border-[#00d4b8]/50 focus:ring-1 focus:ring-[#00d4b8]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7fa3] mb-2 uppercase tracking-widest">Email</label>
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-[#111827] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6b] focus:outline-none focus:border-[#00d4b8]/50 focus:ring-1 focus:ring-[#00d4b8]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7fa3] mb-2 uppercase tracking-widest">Message</label>
            <textarea
              required rows={5} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="What's on your mind?"
              className="w-full bg-[#111827] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6b] focus:outline-none focus:border-[#00d4b8]/50 focus:ring-1 focus:ring-[#00d4b8]/30 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#00d4b8] text-[#0a0f1e] font-semibold rounded-xl hover:bg-[#00bfa6] transition-colors duration-200 text-sm"
          >
            {sent ? "Opening your mail app ✓" : "Send Message"}
          </button>
        </form>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 bg-[#080d1a]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-[#3d4f6b]">
          © 2026 Manav Narula — Built with precision
        </span>
        <div className="flex items-center gap-4">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[#3d4f6b] hover:text-[#00d4b8] transition-colors">
            <Github size={16} />
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#3d4f6b] hover:text-[#00d4b8] transition-colors">
            <Linkedin size={16} />
          </a>
          <a href={`mailto:${LINKS.email}`} aria-label="Email" className="text-[#3d4f6b] hover:text-[#00d4b8] transition-colors">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Back to top ───────────────────────────────────────────────────────────────

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-[#00d4b8] text-[#0a0f1e] flex items-center justify-center shadow-lg shadow-[#00d4b8]/20 transition-all duration-300 hover:bg-[#00bfa6] ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
    document.body.style.background = "#0a0f1e";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#e8edf5]">
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
