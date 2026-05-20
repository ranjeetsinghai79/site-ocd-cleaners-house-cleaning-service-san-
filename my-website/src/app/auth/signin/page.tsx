"use client"

import { useState } from "react"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail]   = useState("")
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In production: POST magic link via Resend
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "40px", justifyContent: "center" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>WebCrew</span>
        </Link>

        <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px" }}>Client login</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginBottom: "28px" }}>
            We'll email you a magic link — no password needed.
          </p>

          {sent ? (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>📬</div>
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>Check your email</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>We sent a login link to {email}</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
              />
              <button type="submit" disabled={loading} style={{ background: loading ? "rgba(249,115,22,0.4)" : "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Sending…" : "Send magic link →"}
              </button>
            </form>
          )}

          <p style={{ marginTop: "20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            New client? <Link href="/auth/signup" style={{ color: "#f97316", textDecoration: "none" }}>Get started</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
