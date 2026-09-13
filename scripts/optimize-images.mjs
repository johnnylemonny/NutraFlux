import { stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const publicDir = join(projectRoot, 'public')

async function optimize() {
  const inputJpg = join(publicDir, 'calorie-bowl.jpg')
  const outputWebp = join(publicDir, 'calorie-bowl.webp')

  console.log('Optimizing calorie-bowl.jpg...')
  const beforeStat = await stat(inputJpg)

  await sharp(inputJpg)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(outputWebp)

  const afterStat = await stat(outputWebp)

  console.log(
    `Done: ${(beforeStat.size / 1024).toFixed(1)} KB -> ${(afterStat.size / 1024).toFixed(1)} KB (${(
      (1 - afterStat.size / beforeStat.size) *
      100
    ).toFixed(1)}% reduction)`,
  )
}

optimize().catch((err) => {
  console.error('Image optimization failed:', err)
  process.exit(1)
})
