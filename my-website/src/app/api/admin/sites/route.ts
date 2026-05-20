import { NextResponse } from 'next/server'
import pg from 'pg'

export const runtime = 'nodejs'

function authorized(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') ?? req.headers.get('x-admin-key')
  return key === process.env.ADMIN_KEY
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const { rows } = await pool.query(`
      SELECT id, name, niche, city, state, address, phone, email,
             vercel_url, github_repo, status, site_score, outreach_sent,
             outreach_sent_at, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 200
    `)

    // Summary stats
    const stats = {
      total:      rows.length,
      deployed:   rows.filter(r => ['deployed','outreach_sent'].includes(r.status)).length,
      outreached: rows.filter(r => r.outreach_sent).length,
      today:      rows.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length,
    }

    return NextResponse.json({ sites: rows, stats })
  } finally {
    await pool.end()
  }
}
