import { createRepoFromTemplate, updateFile, uploadBinaryFile } from '../tools/github.js'
import type { Lead, PipelineConfig, AgentResult } from '../types.js'
import type { HeroImages } from './image-generator.js'

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

const NICHE_TEMPLATE_DIR: Record<string, string> = {
  hvac: 'templates/hvac',
  roofing: 'templates/roofing',
  dentist: 'templates/dentist',
  medspa: 'templates/medspa',
  lawfirm: 'templates/lawfirm',
  remodeling: 'templates/remodeling',
  cleaning: 'templates/cleaning',
  'junk-removal': 'templates/junk-removal',
  daycare: 'templates/daycare',
  'auto-detailing': 'templates/auto-detailing',
  restaurant:          'templates/restaurant',
  'luxury-realestate': 'templates/luxury-realestate',
}

export async function runBuilderAgent(
  lead: Lead,
  config: PipelineConfig,
  heroImages?: HeroImages | null,
  heroVideoBuffer?: Buffer | null
): Promise<AgentResult<Lead>> {
  console.log(`[Builder] Creating repo for ${lead.name}`)

  const repoName = `site-${slugify(lead.name)}`
  const templateDir = NICHE_TEMPLATE_DIR[config.niche] || `templates/${config.niche}`
  const configPath = `${templateDir}/src/lib/config.ts`

  try {
    const repo = await createRepoFromTemplate({
      templateOwner: config.templateOwner,
      templateRepo: config.templateRepo,
      newOwner: config.deployOwner,
      newRepoName: repoName,
    })

    if (!repo) return { success: false, error: 'Failed to create repo from template' }

    const updated = await updateFile({
      owner: config.deployOwner,
      repo: repoName,
      path: configPath,
      content: lead.config_ts!,
      message: `Configure for ${lead.name}`,
    })

    if (!updated) return { success: false, error: `Failed to update ${configPath}` }

    // Upload 4 AI hero images
    if (heroImages) {
      const keys = ['hero-1', 'hero-2', 'hero-3', 'hero-4'] as const
      for (const key of keys) {
        const buf = heroImages[key]
        if (!buf) continue
        const imgOk = await uploadBinaryFile({
          owner: config.deployOwner,
          repo: repoName,
          path: `${templateDir}/public/${key}.jpg`,
          buffer: buf,
          message: `feat: AI hero image ${key}`,
        })
        if (!imgOk) console.warn(`[Builder] ${key} upload failed`)
      }
      console.log(`[Builder] Hero images uploaded`)
    }

    // Upload hero background video (luxury-realestate + any niche with video gen enabled)
    if (heroVideoBuffer) {
      const vidOk = await uploadBinaryFile({
        owner: config.deployOwner,
        repo: repoName,
        path: `${templateDir}/public/hero-bg.mp4`,
        buffer: heroVideoBuffer,
        message: 'feat: AI hero background video',
      })
      if (vidOk) {
        console.log(`[Builder] Hero video uploaded ✓`)
      } else {
        console.warn(`[Builder] Hero video upload failed`)
      }
    }

    return {
      success: true,
      data: {
        ...lead,
        github_repo: repo.html_url,
        status: 'built',
        // Store templateDir so deployer knows which rootDirectory to set
        brand_data: { ...lead.brand_data!, _templateDir: templateDir } as any,
      },
    }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
