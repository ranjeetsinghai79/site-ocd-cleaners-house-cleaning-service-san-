const BASE = 'https://api.cloudflare.com/client/v4'

function headers() {
  return {
    Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export async function deployToCloudflarePages(params: {
  repoOwner: string
  repoName: string
  projectName: string
  templateDir: string
  envVars?: Record<string, string>
}): Promise<{ url: string } | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID not set')

  const { repoOwner, repoName, projectName, templateDir, envVars = {} } = params

  const cfEnvVars: Record<string, { value: string }> = {}
  for (const [k, v] of Object.entries(envVars)) {
    cfEnvVars[k] = { value: v }
  }

  // Create project linked to GitHub repo
  const createRes = await fetch(`${BASE}/accounts/${accountId}/pages/projects`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      name: projectName,
      production_branch: 'main',
      source: {
        type: 'github',
        config: {
          owner: repoOwner,
          repo_name: repoName,
          production_branch: 'main',
          pr_comments_enabled: false,
          deployments_enabled: true,
        },
      },
      build_config: {
        // Monorepo: install at root (resolves @core/web workspace symlink),
        // build only the niche workspace, output goes to <templateDir>/out
        build_command: `npm install --legacy-peer-deps && npm run build --workspace=${templateDir}`,
        destination_dir: `${templateDir}/out`,
        root_dir: '',
      },
      deployment_configs: {
        production: {
          compatibility_date: '2024-09-23',
          compatibility_flags: ['nodejs_compat'],
          env_vars: Object.keys(cfEnvVars).length > 0 ? cfEnvVars : undefined,
        },
      },
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    if (!err.includes('already exists') && !err.includes('taken')) {
      console.error('[Cloudflare] create project failed:', err)
      return null
    }
    console.log('[Cloudflare] project already exists, continuing')
  }

  // Trigger deployment from latest commit
  const deployRes = await fetch(
    `${BASE}/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    { method: 'POST', headers: headers() }
  )

  if (!deployRes.ok) {
    console.error('[Cloudflare] trigger deploy failed:', await deployRes.text())
    return null
  }

  const deployment = (await deployRes.json() as any).result

  // Poll until done (max 10 min, 30s intervals)
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 30_000))

    const statusRes = await fetch(
      `${BASE}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deployment.id}`,
      { headers: headers() }
    )
    const status = (await statusRes.json() as any).result
    const stage = status?.latest_stage

    console.log(`  [Cloudflare] ${stage?.name ?? 'pending'} — ${stage?.status ?? 'waiting'}`)

    if (stage?.name === 'deploy' && stage?.status === 'success') {
      return { url: `https://${projectName}.pages.dev` }
    }
    if (stage?.status === 'failure') {
      console.error('[Cloudflare] deployment failed at stage:', stage?.name)
      return null
    }
  }

  console.error('[Cloudflare] deployment timed out after 10 min')
  return null
}
