"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const PLANS = {
  early:    { label: "Early Bird",   price: "$49/month", stripe: process.env.NEXT_PUBLIC_STRIPE_LINK_EARLY    || "#" },
  standard: { label: "Standard",     price: "$99/month", stripe: process.env.NEXT_PUBLIC_STRIPE_LINK_STANDARD || "#" },
}

function SignupForm() {
  const params   = useSearchParams()
  const planKey  = (params.get("plan") as keyof typeof PLANS) || "early"
  const plan     = PLANS[planKey] || PLANS.early

  const [step, setStep]     = useState<"info"|"done">("info")
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ name: "", email: "", phone: "", business: "", niche: "hvac", city: "" })

  const niches = ["hvac","roofing","plumbing","dentist","medspa","lawfirm","cleaning","auto-detailing","restaurant"]

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Save lead to DB + redirect to Stripe
    try {
      await fetch("/api/admin/signup-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: planKey }),
      })
    } catch {}

    // Redirect to Stripe checkout
    window.location.href = `${plan.stripe}?prefilled_email=${encodeURIComponent(form.email)}`
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none",
    fontFamily: "inherit",
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "40px", justifyContent: "center" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>WebCrew</span>
        </Link>

        <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px" }}>
          {/* Plan badge */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c", fontSize: "12px", fontWeight: 700, padding: "4px 14px", borderRadius: "999px", marginBottom: "16px" }}>
              {plan.label} — {plan.price}
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>
              Get your free website
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>
              We'll build and show you the site. Pay only when you love it.
            </p>
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input style={inp} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
              <input style={inp} placeholder="Business name" value={form.business} onChange={e => setForm(f => ({...f, business: e.target.value}))} required />
            </div>
            <input style={inp} type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
            <input style={inp} type="tel" placeholder="Phone number (for SMS updates)" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <select style={{...inp}} value={form.niche} onChange={e => setForm(f => ({...f, niche: e.target.value}))}>
                {niches.map(n => <option key={n} value={n} style={{ background: "#1e293b" }}>{n.replace("-"," ")}</option>)}
              </select>
              <input style={inp} placeholder="City, State" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required />
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: "8px", background: loading ? "rgba(249,115,22,0.4)" : "linear-gradient(135deg,#f97316,#ea580c)",
              color: "#fff", border: "none", padding: "16px", borderRadius: "12px",
              fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 32px -8px rgba(249,115,22,0.4)", letterSpacing: "-0.2px",
            }}>
              {loading ? "Redirecting to checkout…" : `Start for ${plan.price} →`}
            </button>
          </form>

          <p style={{ marginTop: "20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Already have an account? <Link href="/auth/signin" style={{ color: "#f97316", textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "20px" }}>
          🔒 Secure checkout via Stripe · 30-day money-back guarantee
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
