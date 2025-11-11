import {AnagramGenerator} from './AnagramGenerator.js'

export default class View {
  #container
  #table

  constructor(containerId) {
    this.#container = document.getElementById(containerId)
    if (!this.#container) {
      throw new Error(`Контейнер с id "${containerId}" не найден`)
    }

    this.#init()
  }

  #init() {
    this.#table = document.createElement('table')
    this.#table.classList.add('translations-table')
    this.#container.appendChild(this.#table)
  }

  render(data) {
    this.#clear()
    this.#renderHeader()
    this.#renderRows(data)
  }

  #clear() {
    this.#table.innerHTML = ''
  }

  #renderHeader() {
    const header = document.createElement('tr')
    ;['Json key', 'EN', 'EN Anagram', 'RU', 'RU Anagram'].forEach(text => {
      const th = document.createElement('th')
      th.innerText = text
      header.appendChild(th)
    })
    this.#table.appendChild(header)
  }
  
  async #renderRows(data) {
    for (const [key, {en, ru}] of data) {
      // основная строка таблицы
      const tr = document.createElement('tr')
      const enAnagram = AnagramGenerator.create(en)
      const ruAnagram = AnagramGenerator.create(ru)
      
      ;[key, en, enAnagram, ru, ruAnagram].forEach(value => {
        const td = document.createElement('td')
        td.innerText = value
        tr.appendChild(td)
      })
      
      this.#table.appendChild(tr)
      
      // строка с изображениями
      const images = await this.#findImagesByKey(key)
      if (images.length) {
        this.#table.appendChild(this.#createImagesRow(images))
      }
    }
  }
  
  #createImagesRow(images) {
    const row = document.createElement('tr')
    const cell = document.createElement('td')
    cell.colSpan = 5
    
    const container = document.createElement('div')
    container.classList.add('image-container')
    
    images.forEach(src => {
      const fileName = src.split('/').pop().replace('.png', '')
      
      const card = document.createElement('div')
      card.classList.add('image-card')
      
      const img = document.createElement('img')
      img.src = src
      img.loading = 'lazy'
      img.decoding = 'async'
      
      const caption = document.createElement('span')
      caption.innerText = fileName
      
      card.appendChild(img)
      card.appendChild(caption)
      container.appendChild(card)
    })
    
    cell.appendChild(container)
    row.appendChild(cell)
    return row
  }
  
  async #findImagesByKey(key) {
    const start = 5
    const end = 104
    const step = 10
    
    const found = []
    
    for (let lvl = start; lvl <= end; lvl += step) {
      const folder = `obj-lvl-${lvl}`
      const path = `testPage/src/imges/${folder}/lvl_${lvl}_${key}.png`
      
      try {
        const response = await fetch(path)
        if (response.ok) found.push(path)
      } catch (_) {}
    }
    
    return found
  }
}
