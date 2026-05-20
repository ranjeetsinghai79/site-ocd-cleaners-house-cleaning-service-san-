import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function authorized(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') ?? req.headers.get('x-admin-key')
  return key === process.env.ADMIN_KEY
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = process.env.GITHUB_TOKEN
  const res = await fetch(
    'https://api.github.com/repos/pavankumarharati/websitedeveloper/actions/workflows/daily-pipeline.yml/runs?per_page=10',
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
  )

  const data = await res.json() as any
  const runs = (data.workflow_runs ?? []).map((r: any) => ({
    id:         r.id,
    status:     r.status,
    conclusion: r.conclusion,
    created_at: r.created_at,
    html_url:   r.html_url,
    name:       r.display_title || r.name,
  }))

  return NextResponse.json({ runs })
}
