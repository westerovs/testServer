import { readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const root = './imges'
const folders = readdirSync(root).filter(f => f.startsWith('obj-lvl-'))

const manifest = {}

for (const folder of folders) {
  const files = readdirSync(join(root, folder))
  for (const name of files) {
    if (name.endsWith('.png')) {
      const key = name.replace('.png', '')
      manifest[key] = true
    }
  }
}

writeFileSync(join(root, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log('✅ manifest.json успешно создан')
