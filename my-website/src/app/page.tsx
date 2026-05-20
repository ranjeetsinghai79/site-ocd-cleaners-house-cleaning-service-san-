"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { SplitText, gsap, useTextReveal, useStaggerReveal } from "@core/web"

const NICHES = ["HVAC", "Roofing", "Plumbing", "Dental", "Med Spa", "Cleaning", "Law Firm", "Auto Detailing"]

const DEMOS = [
  { name: "Dell's Heating & Air",          niche: "HVAC",    city: "Tracy, CA",      url: "https://site-dell-s-heating-air-conditioning.pages.dev",          rating: "4.9", reviews: "200+" },
  { name: "JAZZ Heating & Plumbing",        niche: "HVAC",    city: "Tracy, CA",      url: "https://site-jazz-heating-air-conditioning-and-plumbi.pages.dev", rating: "4.8", reviews: "150+" },
  { name: "Manny's Heating & Air",          niche: "HVAC",    city: "Tracy, CA",      url: "https://site-manny-s-heating-and-air-conditioning.pages.dev",    rating: "5.0", reviews: "90+" },
  { name: "Virginia Mechanical",            niche: "HVAC",    city: "Tracy, CA",      url: "https://site-virginia-mechanical-heating-air-conditio.pages.dev", rating: "4.7", reviews: "120+" },
]

const STEPS = [
  { n: "01", title: "We find your business", desc: "Our AI scans Google Maps and builds your site automatically — no forms, no calls, no waiting." },
  { n: "02", title: "Your site goes live",    desc: "A professional website is deployed to the web in minutes. You get a live preview link in your email." },
  { n: "03", title: "Customers start calling",desc: "SEO-optimized, mobile-first, click-to-call — built to turn visitors into paying customers." },
]

const FAQS = [
  { q: "Do I need to do anything to get started?", a: "Nothing. We build your site using your Google Maps data. You just review it and approve." },
  { q: "Can I use my own domain?", a: "Yes. We'll connect your existing domain for free, or help you get a new one for ~$10/year." },
  { q: "What if I don't like the design?", a: "We offer unlimited revision requests in the first 30 days. Not happy? Full refund, no questions." },
  { q: "How fast will I see results?", a: "Most clients see new inbound calls within the first 2–4 weeks as Google indexes the new site." },
  { q: "Do you update the site for me?", a: "Yes. Monthly SEO updates, Google review replies, and content refreshes are included." },
  { q: "What happens if I cancel?", a: "Cancel any time — no contracts. Your site stays live through the end of your billing period." },
]

const TICKER_ITEMS = [
  "⚡ Live in 24 hours", "📱 Mobile-first design", "🔍 Google-optimized",
  "⭐ Review showcase", "📞 Click-to-call", "🔒 Free SSL",
  "🤖 AI-generated images", "📊 Monthly SEO report", "💬 Google review replies",
  "🌐 Custom domain", "🚀 Cloudflare CDN", "♾️ Unlimited edits",
]

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 0", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ display: "flex", gap: "48px", animation: "ticker 30s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function NicheRotator() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % NICHES.length); setVisible(true) }, 300)
    }, 2000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ color: "var(--orange, #f97316)", display: "inline-block", minWidth: "180px", transition: "opacity 0.3s", opacity: visible ? 1 : 0 }}>
      {NICHES[idx]}
    </span>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 24px",
      background: scrolled ? "rgba(3,7,18,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>WebCrew</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <a href="#how" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>How it works</a>
          <a href="#demos" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>Examples</a>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>Pricing</a>
          <Link href="/auth/signup" style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", textDecoration: "none", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 700 }}>
            Get your free site →
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function Home() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: POST to /api/leads or Resend audience
    setSubmitted(true)
  }

  return (
    <div style={{ background: "#030712", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <HomeRest email={email} setEmail={setEmail} submitted={submitted} setSubmitted={setSubmitted} handleSubmit={handleSubmit} />
    </div>
  )
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(labelRef.current, { opacity: 0, y: -16, duration: 0.5 })
      .from(h1Ref.current?.querySelectorAll(".split-word") ?? [], { yPercent: 110, opacity: 0, stagger: 0.05, duration: 0.85 }, "-=0.2")
      .from(paraRef.current,  { opacity: 0, y: 24, duration: 0.6 }, "-=0.5")
      .from(ctaRef.current,   { opacity: 0, y: 20, duration: 0.5 }, "-=0.4")
      .from(statsRef.current?.children ?? [], { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 }, "-=0.3")
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "140px 24px 80px", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg,#030712 0%,#0a0f1e 50%,#030712 100%)",
      }}
    >
      {/* Aurora blobs */}
      <div
        className="aurora-blob-1"
        style={{
          position: "absolute", top: "-200px", right: "-200px",
          width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.22), transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
        }}
      />
      <div
        className="aurora-blob-2"
        style={{
          position: "absolute", bottom: "-200px", left: "-200px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.18), transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
        }}
      />
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
        backgroundSize: "56px 56px",
      }} />
      {/* Vignette */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "1100px" }}>
        <div ref={labelRef} style={{ marginBottom: "24px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)",
            color: "#fb923c", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            padding: "7px 18px", borderRadius: "999px",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f97316", display: "inline-block", animation: "pulse-dot 1.8s ease-in-out infinite" }} />
            Early Bird — $49/mo · Limited spots
          </span>
        </div>

        <h1
          ref={h1Ref}
          style={{
            fontSize: "clamp(2.6rem, 8.5vw, 7.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            marginBottom: "32px",
          }}
        >
          <SplitText>AI-Powered Websites</SplitText>
          <br />
          <span className="text-gradient-animate webcrew-grad">
            <SplitText>for Local Businesses.</SplitText>
          </span>
        </h1>

        <p
          ref={paraRef}
          style={{
            fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
            maxWidth: "640px",
            margin: "0 auto 48px",
            fontWeight: 400,
          }}
        >
          We find your business, build the site, deploy it, optimize it.
          <br/>
          All automatically. <span style={{ color: "#fff" }}>One new customer pays for the whole year.</span>
        </p>

        <div ref={ctaRef} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "56px" }}>
          <a href="#pricing" style={{
            background: "linear-gradient(135deg,#f97316,#ea580c,#f97316)",
            backgroundSize: "200% auto",
            color: "#fff",
            textDecoration: "none",
            padding: "18px 36px",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            boxShadow: "0 12px 48px -12px rgba(249,115,22,0.6)",
            animation: "gradient-shimmer 3s linear infinite",
          }}>
            See your free demo →
          </a>
          <a href="#demos" style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.85)",
            textDecoration: "none",
            padding: "18px 36px",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "border-color 0.3s, color 0.3s",
          }}>
            View live examples
          </a>
        </div>

        <div ref={statsRef} style={{ display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            ["24h", "Live in 24 hours"],
            ["$0", "No setup fee"],
            ["4.9★", "Average rating"],
            ["100%", "Money-back guarantee"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#f97316", letterSpacing: "-0.04em", lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Rotator below stats */}
        <div style={{ marginTop: "56px", fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Built for <NicheRotator />
        </div>
      </div>
    </section>
  )
}

function HomeRest({ email, setEmail, submitted, setSubmitted, handleSubmit }: {
  email: string
  setEmail: (e: string) => void
  submitted: boolean
  setSubmitted: (s: boolean) => void
  handleSubmit: (e: React.FormEvent) => void
}) {
  return (
    <>
      <Ticker />

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="how" style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f97316", display: "block", marginBottom: "12px" }}>How it works</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>
            Your site is live before you even sign up
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "17px", maxWidth: "520px", margin: "0 auto" }}>
            No forms. No meetings. No waiting. We build it, then we show you.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "20px", right: "24px", fontSize: "56px", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>{step.n}</div>
              <div style={{ width: "48px", height: "48px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <span style={{ color: "#f97316", fontSize: "20px", fontWeight: 800 }}>{step.n}</span>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px", marginBottom: "12px" }}>{step.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: "15px" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE DEMOS ──────────────────────────────────── */}
      <section id="demos" style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f97316", display: "block", marginBottom: "12px" }}>Live examples</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>
              Real sites. Real businesses. Live right now.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "17px" }}>Click any site to see it live.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px" }}>
            {DEMOS.map((demo, i) => (
              <a key={i} href={demo.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px",
                  overflow: "hidden", transition: "border-color 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.transform = "" }}
                >
                  {/* Fake browser preview */}
                  <div style={{ height: "180px", background: "linear-gradient(135deg,#0f172a,#1e3a5f)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", height: "28px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", display: "flex", alignItems: "center", padding: "0 12px", gap: "6px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginLeft: "8px" }}>{demo.url.replace("https://","")}</span>
                    </div>
                    {/* Site preview iframe */}
                    <iframe
                      src={demo.url}
                      style={{ position: "absolute", top: "44px", left: 0, width: "200%", height: "200%", border: "none", transform: "scale(0.5)", transformOrigin: "0 0", pointerEvents: "none" }}
                      title={demo.name}
                    />
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "-0.2px", marginBottom: "4px" }}>{demo.name}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{demo.city}</div>
                      </div>
                      <span style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", color: "#fb923c", fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {demo.niche}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "#fbbf24", fontSize: "13px" }}>★</span>
                      <span style={{ fontSize: "13px", fontWeight: 700 }}>{demo.rating}</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>({demo.reviews} reviews)</span>
                      <span style={{ marginLeft: "auto", fontSize: "12px", color: "#f97316", display: "flex", alignItems: "center", gap: "4px" }}>
                        Live ↗
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ─────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f97316", display: "block", marginBottom: "12px" }}>Everything included</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-1px" }}>
            We handle everything. You handle calls.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
          {[
            ["⚡", "Lightning fast", "Sub-second load on mobile. Google rewards speed."],
            ["📱", "Mobile-first", "70% of your customers search from their phone."],
            ["🔍", "SEO built in", "Sitemap, schema markup, keyword-optimized copy."],
            ["⭐", "Review showcase", "Your Google rating, front and center."],
            ["📞", "Click-to-call", "One tap to call — the most important button."],
            ["🤖", "AI hero images", "Professional photos generated for your business."],
            ["📊", "Monthly reports", "Google Search Console data, emailed monthly."],
            ["💬", "Review replies", "We reply to your Google reviews automatically."],
            ["🌐", "Custom domain", "We connect your domain or get you one."],
            ["🔒", "SSL & hosting", "Cloudflare CDN, 99.99% uptime, free SSL."],
            ["✏️", "Unlimited edits", "Change anything, any time. Just ask."],
            ["📧", "Lead capture", "Contact form → your email + CRM."],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "24px 20px" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{title}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 24px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f97316", display: "block", marginBottom: "12px" }}>Pricing</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>
              Less than one customer pays for itself
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "17px" }}>
              No contracts. No setup fees. Cancel any time.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "24px" }}>
            {/* Early Bird */}
            <div style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04))", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "20px", padding: "40px 36px", position: "relative" }}>
              <div style={{ position: "absolute", top: "-12px", left: "36px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 16px", borderRadius: "999px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                🔥 Early Bird — Limited
              </div>
              <div style={{ marginBottom: "24px", paddingTop: "8px" }}>
                <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1 }}>
                  $49
                  <span style={{ fontSize: "18px", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: 0 }}>/month</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "14px" }}>
                  Locked forever for first 100 clients. Price goes up after that.
                </p>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Professional website, live in 24h", "Custom domain connection", "AI hero images for your business", "Monthly SEO + traffic report", "Google review replies (automated)", "Lead capture form → your email", "Unlimited edit requests", "Priority support", "30-day money-back guarantee"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.75)", alignItems: "flex-start" }}>
                    <span style={{ color: "#22c55e", fontSize: "16px", flexShrink: 0, marginTop: "-1px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=early" style={{ display: "block", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", textDecoration: "none", textAlign: "center", padding: "16px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", boxShadow: "0 8px 32px -8px rgba(249,115,22,0.5)", letterSpacing: "-0.2px" }}>
                Claim Early Bird Spot →
              </Link>
            </div>

            {/* Standard */}
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px 36px" }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1 }}>
                  $99
                  <span style={{ fontSize: "18px", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: 0 }}>/month</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "14px" }}>
                  Standard rate after early bird spots are filled.
                </p>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Everything in Early Bird", "SMS outreach setup", "Google Business Profile updates", "Competitor analysis report", "Quarterly design refresh"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.6)", alignItems: "flex-start" }}>
                    <span style={{ color: "#22c55e", fontSize: "16px", flexShrink: 0, marginTop: "-1px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=standard" style={{ display: "block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", textDecoration: "none", textAlign: "center", padding: "16px", borderRadius: "12px", fontWeight: 600, fontSize: "16px" }}>
                Get started →
              </Link>
            </div>
          </div>

          {/* Guarantee strip */}
          <div style={{ marginTop: "32px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "14px", padding: "20px 28px", display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "32px" }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>30-Day Money-Back Guarantee</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
                Not happy in your first 30 days? We'll refund every cent. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, letterSpacing: "-1px" }}>
            Frequently asked questions
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 120px", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "20px" }}>
            Stop losing customers<br />to your competitors
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "17px", marginBottom: "40px", lineHeight: 1.6 }}>
            Your site is already built. All you have to do is say yes.<br />
            First month free if you sign up today.
          </p>
          {submitted ? (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px", color: "#86efac", fontWeight: 600 }}>
              ✓ Got it! We'll email your free demo within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", maxWidth: "480px", margin: "0 auto", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, minWidth: "220px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "15px", outline: "none" }}
              />
              <button type="submit" style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                Get my free demo →
              </button>
            </form>
          )}
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "16px" }}>
            No credit card required. See your site in 24 hours.
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: 900 }}>B</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: "16px" }}>WebCrew</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginLeft: "8px" }}>© 2025</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/admin" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "13px" }}>Admin</Link>
            <a href="mailto:hello@webcrew.dev" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px" }}>hello@webcrew.dev</a>
            <Link href="/auth/signin" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px" }}>Client login</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse-ring { 0% { transform:scale(1);opacity:0.6; } 100% { transform:scale(2);opacity:0; } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes float-up { from { opacity:0;transform:translateY(32px); } to { opacity:1;transform:translateY(0); } }
        .animate-up { animation: float-up 0.65s cubic-bezier(0.25,0.46,0.45,0.94) both; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.22s; }
        .delay-3 { animation-delay: 0.34s; } .delay-4 { animation-delay: 0.46s; }
      `}</style>
      <style>{`
        .webcrew-grad,
        .webcrew-grad .word-wrap,
        .webcrew-grad .word-inner {
          background: linear-gradient(135deg,#fb923c,#f97316,#fb923c);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gradient-shimmer 4s linear infinite;
        }
      `}</style>
    </>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", textAlign: "left" }}>
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{q}</span>
        <span style={{ color: "#f97316", fontSize: "20px", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px", color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  )
}
