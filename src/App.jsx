import { useEffect, useMemo, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { ArrowRight, ExternalLink, Play, RefreshCw, Calendar, BarChart3, LucideYoutube, Mail, BookOpen, ChevronDown } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

const neon = '#00E6A8'
const bg = '#0F1115'

function useOnScrollAnimation(threshold = 0.2) {
  const controls = useAnimation()
  const [ref, setRef] = useState(null)
  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) controls.start('visible')
        })
      },
      { threshold }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])
  return { ref: setRef, controls }
}

function TypingHeadline({ text }) {
  const [display, setDisplay] = useState('')
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplay((prev) => (i < text.length ? text.slice(0, i + 1) : text))
      i++
      if (i > text.length) {
        setTimeout(() => {
          i = 0
          setDisplay('')
        }, 1600)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [text])
  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight" style={{ color: 'white' }}>
      <span className="text-white/90">{display}</span>
      <span className="ml-1 inline-block w-1 h-6 sm:h-10 bg-white/80 animate-pulse align-middle"></span>
    </h1>
  )
}

function Section({ children, className = '' }) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }
  const { ref, controls } = useOnScrollAnimation(0.25)
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={`max-w-7xl mx-auto px-5 sm:px-8 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function Hero() {
  return (
    <div className="relative min-h-[88vh] w-full overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vc19ejtcC5VJjy5v/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: neon }}></div>
            YouTube Scriptwriting • India
          </div>
          <TypingHeadline text="Turning ideas into videos people watch till the end." />
          <p className="mt-5 text-white/70 max-w-xl">
            I’m Nikhil Lohia — YouTube scriptwriter from India. I write scripts that hook, retain, and convert viewers.
          </p>
          <p className="mt-2 text-white/50 text-sm">Email: <a href="mailto:nikhillohia08@gmail.com" className="underline decoration-dotted hover:text-white">nikhillohia08@gmail.com</a></p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#best-work" className="group inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-black" style={{ backgroundColor: neon }}>
              View My Best Work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a target="_blank" rel="noreferrer" href="https://cal.com/nikhil-lohia-20/15min" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition">
              Book a Call
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
        <div className="relative h-[360px] sm:h-[480px] md:h-[520px]">
          <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_60px_rgba(0,230,168,0.15)]" />
          <div className="absolute -inset-12 blur-3xl opacity-30" style={{ background: `radial-gradient(600px 200px at 60% 30%, ${neon}, transparent)` }} />
        </div>
      </div>
      <a href="#best-work" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-white flex items-center gap-2 text-sm">
        Scroll
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </div>
  )
}

function MetricPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs">
      <Icon className="size-3.5 text-white/60" />
      <span>{label}</span>
    </div>
  )
}

function BestWork() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${BACKEND_URL}/api/notion/best-work`)
        const data = await r.json()
        setItems(data)
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const refresh = async (url) => {
    try {
      const r = await fetch(`${BACKEND_URL}/api/youtube/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const updated = await r.json()
      setItems((prev) => prev.map((it) => (it.youtube_url === url ? updated : it)))
    } catch {}
  }

  return (
    <Section className="py-20" id="best-work">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">My Highest-Performing Scripts</h2>
          <p className="text-white/60 mt-2">My top 3 scripts — full breakdowns, performance & scripts.</p>
        </div>
      </div>
      {loading ? (
        <p className="text-white/60">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.div key={idx} whileHover={{ y: -4 }} className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0B0D12]">
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                {it.thumbnail_url ? (
                  <img src={it.thumbnail_url} alt={it.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/40 text-sm">Thumbnail</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <a href={it.youtube_url} target="_blank" rel="noreferrer" className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: neon }}>
                  <Play className="size-3.5" /> Watch Video
                </a>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold line-clamp-2">{it.title}</h3>
                <p className="text-white/60 text-sm">{it.channel || 'Channel'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <MetricPill icon={BarChart3} label={`${it.metrics?.views ?? '—'} views`} />
                  <MetricPill icon={Calendar} label={it.metrics?.upload_date ? new Date(it.metrics.upload_date).toLocaleDateString() : '—'} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => refresh(it.youtube_url)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/80 hover:bg-white/5 transition text-xs">
                    <RefreshCw className="size-3.5" /> Refresh metrics
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white text-xs">
                    <BookOpen className="size-3.5" /> View Case Study
                  </button>
                </div>
                <p className="text-white/60 text-xs mt-2">Last updated: {it.metrics?.last_updated ? new Date(it.metrics.last_updated).toLocaleString() : '—'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  )
}

function LogoWall() {
  const [logos, setLogos] = useState([])
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${BACKEND_URL}/api/logos`)
        const d = await r.json()
        setLogos(d)
      } catch (e) { setLogos([]) }
    }
    load()
  }, [])
  return (
    <Section className="py-16">
      <h3 className="text-white text-xl sm:text-2xl font-semibold mb-6">Creators I’ve Worked With</h3>
      <div className="overflow-hidden">
        <div className="flex gap-10 animate-[scroll_30s_linear_infinite]" style={{ willChange: 'transform' }}>
          {logos.map((l, i) => (
            <a key={i} href={l.link_url || '#'} target={l.link_url ? '_blank' : undefined} rel="noreferrer" className="shrink-0 w-40 h-20 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:scale-[1.02] transition">
              {l.image_url ? <img src={l.image_url} alt={l.name} className="max-h-12 object-contain" loading="lazy" /> : <span className="text-white/50 text-sm">Logo</span>}
              <span className="sr-only">{l.name}</span>
            </a>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </Section>
  )
}

function FAQ() {
  const items = [
    { q: 'How does your scriptwriting process work?', a: 'Brief → research → draft → revision → final.' },
    { q: 'What niches do you write for?', a: 'Tech, education, lifestyle, product reviews, storytelling.' },
    { q: 'How long until delivery?', a: 'Typically 3–7 days depending on length; rush available.' },
    { q: 'Do you provide script hooks and thumbnails ideas?', a: 'Yes — hooks, retention pillars, and thumbnail ideas included.' },
    { q: 'Can I see the full analytics?', a: 'Yes — open a case study or email to request full analytics.' },
  ]
  const [open, setOpen] = useState(0)
  return (
    <Section className="py-16">
      <h3 className="text-white text-xl sm:text-2xl font-semibold mb-6">FAQ</h3>
      <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
        {items.map((it, i) => (
          <div key={i} className="bg-white/5">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left px-5 py-4 text-white/90 font-medium flex items-center justify-between">
              {it.q}
              <ChevronDown className={`size-4 transition ${open===i? 'rotate-180':''}`} />
            </button>
            <AnimatePresence initial={false}>
              {open===i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-4 text-white/70">
                  {it.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Embeds() {
  const [drive, setDrive] = useState('')
  useEffect(() => { (async () => {
    try {
      const r = await fetch(`${BACKEND_URL}/api/drive/embed`)
      const d = await r.json(); setDrive(d.embed_url)
    } catch {}
  })() }, [])
  return (
    <Section className="py-16">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-white text-xl sm:text-2xl font-semibold mb-3">Notion</h3>
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe title="Notion" src="https://www.notion.so/embed" className="w-full h-full" loading="lazy" />
          </div>
          <a href="https://reinvented-salute-989.notion.site/Nikhil-Lohia-2aaf06f4560e8069ac8ff6149020cbe2" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-white/70 hover:text-white">Open full Notion <ExternalLink className="size-4" /></a>
        </div>
        <div>
          <h3 className="text-white text-xl sm:text-2xl font-semibold mb-3">Drive</h3>
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
            {drive ? (
              <iframe title="Drive" src={drive} className="w-full h-full" loading="lazy" />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/50">Drive loading…</div>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

function Contact() {
  return (
    <Section className="py-20">
      <div className="text-center">
        <h3 className="text-white text-2xl sm:text-3xl font-bold">Let’s write your next viral script.</h3>
        <div className="mt-5 flex items-center justify-center gap-3">
          <a href="mailto:nikhillohia08@gmail.com" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 text-white hover:bg-white/5">Email: nikhillohia08@gmail.com</a>
          <a target="_blank" rel="noreferrer" href="https://cal.com/nikhil-lohia-20/15min" className="group inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-black" style={{ backgroundColor: neon }}>
            Book a 15-min call <ExternalLink className="size-4" />
          </a>
        </div>
        <p className="text-white/60 text-sm mt-3">Prefer email? Send your channel link & 1-line brief.</p>
      </div>
    </Section>
  )
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.title = 'Nikhil Lohia — YouTube Scriptwriter | Hook. Retain. Convert.'
  }, [])
  return (
    <div className="min-h-screen" style={{ background: bg, fontFamily: 'Inter, Manrope, IBM Plex Sans, ui-sans-serif, system-ui' }}>
      <Hero />
      <BestWork />
      <LogoWall />
      <FAQ />
      <Embeds />
      <Contact />
      <footer className="border-t border-white/10 py-6 text-center text-white/50 text-sm">Email: nikhillohia08@gmail.com • Bookings: 15 min call</footer>
    </div>
  )
}
