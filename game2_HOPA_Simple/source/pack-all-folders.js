// запуск: node pack-all-folders.js

const path = require('path')
const fs = require('fs')
const packer = require('free-tex-packer-core')

const inputRoot = path.join(__dirname, 'SpriteSheets')
const outputRoot = path.join(__dirname, 'build')

const tinify = require('tinify')
tinify.key = 'PdWgKfFJrnqwLGtzMxqBhZy1YdwFB2jb'

fs.mkdirSync(outputRoot, { recursive: true })

/*** рекурсивно собирает все png-файлы в папке ***/
function collectPngFilesRecursively(dir) {
  let result = []
  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      result = result.concat(collectPngFilesRecursively(fullPath))
    } else if (entry.endsWith('.png')) {
      result.push({
        path: path.relative(dir, fullPath).replace(/\\/g, '/'),
        contents: fs.readFileSync(fullPath)
      })
    }
  }

  return result
}

/*** только верхнеуровневые подпапки ***/
const topFolders = fs.readdirSync(inputRoot).filter(name => {
  const fullPath = path.join(inputRoot, name)
  return fs.statSync(fullPath).isDirectory()
})

topFolders.forEach(folderName => {
  const folderPath = path.join(inputRoot, folderName)

  const images = collectPngFilesRecursively(folderPath)

  if (!images.length) return

  const textureName = folderName

  packer(images, {
    textureName,
    width: 2048,
    height: 2048,
    fixedSize: false,
    powerOfTwo: false,
    padding: 1,
    allowRotation: true,
    detectIdentical: true,
    allowTrim: true,
    trimMode: 'trim',
    alphaThreshold: 0,
    exporter: 'Pixi',
    removeFileExtension: true,
    packer: 'MaxRectsPacker',
    packerMethod: 'Smart'
  }, async (packedFiles) => {
    for (const f of packedFiles) {
      const outputPath = path.join(outputRoot, f.name)

      if (f.name.endsWith('.png')) {
        const compressed = await tinify.fromBuffer(f.buffer).toBuffer()
        fs.writeFileSync(outputPath, compressed)
        console.log(`✓ png compressed: ${f.name}`)
      } else if (f.name.endsWith('.json')) {
        const jsonStr = JSON.stringify(JSON.parse(f.buffer.toString()))
        fs.writeFileSync(outputPath, jsonStr)
        console.log(`✓ json saved: ${f.name}`)
      } else {
        fs.writeFileSync(outputPath, f.buffer)
        console.log(`✓ Saved: ${f.name}`)
      }
    }
  })
})
