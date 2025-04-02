// запуск: node pack-all-folders.js

const path = require('path')
const fs = require('fs')
const packer = require('free-tex-packer-core')

/*** изменения ***/
const inputRoot = path.join(__dirname, 'SpriteSheets')
const outputRoot = path.join(__dirname, 'build')
/*** конец изменений ***/

const tinify = require('tinify')
tinify.key = 'PdWgKfFJrnqwLGtzMxqBhZy1YdwFB2jb'

fs.mkdirSync(outputRoot, { recursive: true })

/*** изменения ***/
const folders = fs.readdirSync(inputRoot).filter(name => {
  const fullPath = path.join(inputRoot, name)
  return fs.statSync(fullPath).isDirectory()
})
/*** конец изменений ***/

folders.forEach(folder => {
  const folderPath = path.join(inputRoot, folder)
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png'))

  const images = files.map(file => ({
    path: file,
    contents: fs.readFileSync(path.join(folderPath, file))
  }))

  if (!images.length) return

  /*** изменения ***/
  const textureName = folder
  /*** конец изменений ***/

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
