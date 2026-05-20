"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Play, RefreshCw, ExternalLink, Globe, Mail, AlertCircle,
  CheckCircle, Clock, Zap, BarChart3, Users, TrendingUp, Settings
} from "lucide-react"

const NICHES = ['hvac','roofing','plumbing','dentist','medspa','lawfirm','cleaning','auto-detailing']
const METROS = [
  'Tracy-Stockton','Modesto','Fresno','Sacramento','San Jose','East Bay',
  'Inland Empire','San Diego','Dallas suburbs','Houston suburbs','San Antonio',
  'Phoenix suburbs','Tucson','Orlando suburbs','Tampa suburbs','Las Vegas',
]

type Site = {
  id: string
  name: string
  niche: string
  city: string
  state: string
  phone: string
  email: string
  vercel_url: string
  github_repo: string
  status: string
  site_score: number
  outreach_sent: boolean
  outreach_sent_at: string
  created_at: string
}

type Stats = { total: number; deployed: number; outreached: number; today: number }
type Run   = { id: number; status: string; conclusion: string; created_at: string; html_url: string; name: string }

const STATUS_COLOR: Record<string, string> = {
  deployed:      '#22c55e',
  outreach_sent: '#3b82f6',
  built:         '#f59e0b',
  analyzed:      '#8b5cf6',
  scored:        '#6b7280',
  error:         '#ef4444',
  skipped:       '#374151',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      background: STATUS_COLOR[status] + '22',
      color: STATUS_COLOR[status] || '#9ca3af',
      border: `1px solid ${STATUS_COLOR[status] || '#374151'}44`,
      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
    }}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function AdminPage() {
  const [key, setKey]           = useState('')
  const [authed, setAuthed]     = useState(false)
  const [sites, setSites]       = useState<Site[]>([])
  const [stats, setStats]       = useState<Stats | null>(null)
  const [runs, setRuns]         = useState<Run[]>([])
  const [loading, setLoading]   = useState(false)
  const [triggering, setTriggering] = useState(false)
  const [msg, setMsg]           = useState('')

  // Pipeline form state
  const [niche, setNiche] = useState('hvac')
  const [metro, setMetro] = useState('')
  const [count, setCount] = useState(5)
  const [dryRun, setDryRun] = useState(false)

  const fetchData = useCallback(async (k: string) => {
    setLoading(true)
    try {
      const [sitesRes, runsRes] = await Promise.all([
        fetch(`/api/admin/sites?key=${k}`),
        fetch(`/api/admin/workflow-runs?key=${k}`),
      ])
      if (sitesRes.status === 401) { setAuthed(false); return }
      const sitesData = await sitesRes.json()
      const runsData  = await runsRes.json()
      setSites(sitesData.sites ?? [])
      setStats(sitesData.stats ?? null)
      setRuns(runsData.runs ?? [])
      setAuthed(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchData(key)
  }

  const triggerPipeline = async () => {
    setTriggering(true)
    setMsg('')
    try {
      const res = await fetch(`/api/admin/trigger?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, metro, count, dry_run: dryRun }),
      })
      const data = await res.json()
      if (data.triggered) {
        setMsg(`Pipeline triggered — ${niche.toUpperCase()} ${metro || '(auto-rotate)'}. Check GitHub Actions.`)
        setTimeout(() => fetchData(key), 3000)
      } else {
        setMsg('Error: ' + (data.error ?? 'Unknown'))
      }
    } finally {
      setTriggering(false)
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '40px', width: '340px' }}>
          <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>WebCrew Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 28px' }}>Pipeline dashboard</p>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={e => setKey(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button
            type="submit"
            style={{ marginTop: '16px', width: '100%', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  const deployed = sites.filter(s => ['deployed','outreach_sent'].includes(s.status))

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px' }}>WebCrew Pipeline</span>
        </div>
        <button
          onClick={() => fetchData(key)}
          disabled={loading}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>

        {/* Stats row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { icon: <Users size={18} />, label: 'Total leads', value: stats.total, color: '#6b7280' },
              { icon: <Globe size={18} />, label: 'Sites live', value: stats.deployed, color: '#22c55e' },
              { icon: <Mail size={18} />, label: 'Outreached', value: stats.outreached, color: '#3b82f6' },
              { icon: <TrendingUp size={18} />, label: 'Today', value: stats.today, color: '#f59e0b' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px' }}>
                <div style={{ color, marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* Sites table */}
          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Live Sites ({deployed.length})
            </h2>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Business', 'Niche', 'City', 'Status', 'Score', 'Outreach', 'Live URL'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deployed.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No deployed sites yet. Run the pipeline →</td></tr>
                  ) : deployed.map((site, i) => (
                    <tr key={site.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{site.name}</div>
                        {site.phone && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{site.phone}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>{site.niche}</td>
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.55)' }}>{site.city}, {site.state}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={site.status} /></td>
                      <td style={{ padding: '12px 16px', color: site.site_score < 40 ? '#ef4444' : site.site_score < 60 ? '#f59e0b' : '#22c55e', fontWeight: 700 }}>
                        {site.site_score ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {site.outreach_sent
                          ? <CheckCircle size={14} color="#22c55e" />
                          : <Clock size={14} color="rgba(255,255,255,0.25)" />
                        }
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {site.vercel_url ? (
                          <a href={`https://${site.vercel_url}`} target="_blank" rel="noreferrer"
                            style={{ color: '#f97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View <ExternalLink size={11} />
                          </a>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent pipeline runs */}
            {runs.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h2 style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recent Pipeline Runs
                </h2>
                <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                  {runs.map((run, i) => {
                    const isRunning = run.status === 'in_progress' || run.status === 'queued'
                    const icon = isRunning ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> :
                                 run.conclusion === 'success' ? <CheckCircle size={12} color="#22c55e" /> :
                                 run.conclusion === 'failure' ? <AlertCircle size={12} color="#ef4444" /> :
                                 <Clock size={12} color="#6b7280" />
                    return (
                      <div key={run.id} style={{ padding: '12px 16px', borderBottom: i < runs.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ color: isRunning ? '#f59e0b' : run.conclusion === 'success' ? '#22c55e' : '#ef4444' }}>{icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{run.name || 'Pipeline run'}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{new Date(run.created_at).toLocaleString()}</div>
                        </div>
                        <a href={run.html_url} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — run pipeline */}
          <div style={{ position: 'sticky', top: '32px' }}>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Zap size={16} color="#f97316" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Run Pipeline</h3>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Niche</label>
                <select
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}
                >
                  {NICHES.map(n => <option key={n} value={n} style={{ background: '#1e293b' }}>{n}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Metro (blank = auto-rotate)</label>
                <select
                  value={metro}
                  onChange={e => setMetro(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}
                >
                  <option value="" style={{ background: '#1e293b' }}>Auto-rotate</option>
                  {METROS.map(m => <option key={m} value={m} style={{ background: '#1e293b' }}>{m}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Leads to process</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="dryrun"
                  checked={dryRun}
                  onChange={e => setDryRun(e.target.checked)}
                  style={{ accentColor: '#f97316' }}
                />
                <label htmlFor="dryrun" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer' }}>Dry run (no deploy)</label>
              </div>

              <button
                onClick={triggerPipeline}
                disabled={triggering}
                style={{
                  width: '100%', background: triggering ? 'rgba(249,115,22,0.3)' : 'linear-gradient(135deg,#f97316,#ea580c)',
                  color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700,
                  cursor: triggering ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'opacity 0.2s',
                }}
              >
                {triggering ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Triggering…</> : <><Play size={14} fill="currentColor" /> Run Pipeline</>}
              </button>

              {msg && (
                <div style={{ marginTop: '14px', padding: '10px 14px', background: msg.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${msg.startsWith('Error') ? '#ef444433' : '#22c55e33'}`, borderRadius: '8px', fontSize: '12px', color: msg.startsWith('Error') ? '#f87171' : '#86efac', lineHeight: 1.5 }}>
                  {msg}
                </div>
              )}
            </div>

            {/* Schedule info */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Settings size={14} color="rgba(255,255,255,0.4)" />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auto Schedule</span>
              </div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.6 }}>
                Pipeline runs automatically<br />
                <strong style={{ color: '#fff' }}>Mon–Fri at 9:00 AM PST</strong><br />
                Auto-rotates through metro areas.
              </p>
              <a
                href="https://github.com/pavankumarharati/websitedeveloper/actions"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f97316', textDecoration: 'none', fontSize: '12px', marginTop: '12px' }}
              >
                View GitHub Actions <ExternalLink size={10} />
              </a>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select option { background: #1e293b; }
      `}</style>
    </div>
  )
}
