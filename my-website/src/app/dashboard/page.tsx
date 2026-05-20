"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

type SiteData = {
  name: string
  niche: string
  city: string
  vercel_url: string
  status: string
  google_rating: string
  review_count: string
  created_at: string
  next_billing: string
  plan: string
}

function DashboardContent() {
  const params  = useSearchParams()
  const token   = params.get("t")
  const [data, setData]   = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production: fetch site data using the token from URL (post-Stripe redirect)
    // For now, show demo state
    setTimeout(() => {
      setData({
        name:         "Your Business Name",
        niche:        "hvac",
        city:         "Tracy, CA",
        vercel_url:   "your-site.pages.dev",
        status:       "live",
        google_rating:"4.9",
        review_count: "147",
        created_at:   new Date().toISOString(),
        next_billing: new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US"),
        plan:         "Early Bird · $49/month",
      })
      setLoading(false)
    }, 800)
  }, [token])

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(249,115,22,0.3)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading your dashboard…</p>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  const d = data!
  const siteUrl = `https://${d.vercel_url}`

  return (
    <div style={{ minHeight: "100vh", background: "#030712", fontFamily: "Inter,-apple-system,sans-serif" }}>
      {/* Nav */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>WebCrew</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Site live</span>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>{d.name}</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>{d.niche.toUpperCase()} · {d.city} · {d.plan}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { icon: "🌐", label: "Status", value: "Live", color: "#22c55e" },
            { icon: "⭐", label: "Google Rating", value: d.google_rating },
            { icon: "💬", label: "Reviews", value: d.review_count + "+" },
            { icon: "📅", label: "Next billing", value: d.next_billing },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px 24px" }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color || "#fff", letterSpacing: "-0.5px" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Your site */}
        <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontWeight: 700, fontSize: "15px" }}>Your website</span>
            <a href={siteUrl} target="_blank" rel="noreferrer" style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", textDecoration: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
              View live site ↗
            </a>
          </div>
          <div style={{ height: "320px", position: "relative", overflow: "hidden" }}>
            <iframe src={siteUrl} style={{ width: "150%", height: "150%", border: "none", transform: "scale(0.667)", transformOrigin: "0 0", pointerEvents: "none" }} title="Your site" />
          </div>
          <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.02)" }}>
            <a href={siteUrl} style={{ color: "#f97316", textDecoration: "none", fontSize: "13px" }}>{siteUrl}</a>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px" }}>
          {[
            { icon: "✏️", label: "Request changes", desc: "Send us your edit requests", href: "mailto:hello@webcrew.dev?subject=Site edit request" },
            { icon: "🌐", label: "Connect domain", desc: "Use your own .com domain", href: "mailto:hello@webcrew.dev?subject=Connect my domain" },
            { icon: "📊", label: "SEO report", desc: "View last month's traffic", href: "#" },
            { icon: "💳", label: "Billing", desc: "Manage your subscription", href: "#" },
          ].map(a => (
            <a key={a.label} href={a.href} style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", textDecoration: "none", display: "block", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{a.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{a.label}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{a.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>
}
