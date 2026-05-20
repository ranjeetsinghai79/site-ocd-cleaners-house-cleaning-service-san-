import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function authorized(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') ?? req.headers.get('x-admin-key')
  return key === process.env.ADMIN_KEY
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { niche, metro, count, dry_run } = await req.json()

  const token = process.env.GITHUB_TOKEN
  const owner = 'pavankumarharati'
  const repo  = 'websitedeveloper'
  const workflow = 'daily-pipeline.yml'

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          niche:   niche   || 'hvac',
          metro:   metro   || '',
          count:   String(count || 5),
          dry_run: String(dry_run || false),
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  return NextResponse.json({ triggered: true, niche, metro, count })
}
