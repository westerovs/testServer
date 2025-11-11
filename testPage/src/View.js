import {AnagramGenerator} from './AnagramGenerator.js'

export default class View {
  #container
  #table
  #manifest
  
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
    
    document.getElementById('download-json')?.addEventListener('click', () => this.#downloadJSON())
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
      img.dataset.src = src // 👈 вместо прямого src
      img.width = 120
      img.height = 120
      img.loading = 'lazy'
      
      const caption = document.createElement('span')
      caption.innerText = fileName
      
      card.appendChild(img)
      card.appendChild(caption)
      container.appendChild(card)
    })
    
    cell.appendChild(container)
    row.appendChild(cell)
    
    // 👇 Ленивая загрузка с IntersectionObserver
    this.#observeImages(container.querySelectorAll('img'))
    
    return row
  }
  
  #observeImages(images) {
    if (!('IntersectionObserver' in window)) {
      images.forEach(img => img.src = img.dataset.src)
      return
    }
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '200px 0px', // заранее загружает при приближении
      threshold: 0.1
    })
    
    images.forEach(img => observer.observe(img))
  }
  
  async #findImagesByKey(key) {
    if (!this.#manifest) {
      const res = await fetch('testPage/src/imges/manifest.json')
      this.#manifest = await res.json()
    }
    
    const found = []
    for (let lvl = 5; lvl <= 104; lvl += 10) {
      const file = `lvl_${lvl}_${key}`
      if (this.#manifest[file]) {
        found.push(`testPage/src/imges/obj-lvl-${lvl}/${file}.png`)
      }
    }
    
    return found
  }
  
  #downloadJSON() {
    const rows = this.#table.querySelectorAll('tr')
    const data = {}
    
    // Пропускаем первую строку (заголовок)
    rows.forEach((row, i) => {
      if (i === 0) return
      const cells = row.querySelectorAll('td')
      if (cells.length >= 5) {
        const key = cells[0].innerText.trim()
        const en = cells[1].innerText.trim()
        const ru = cells[3].innerText.trim()
        
        data[key] = { en, ru }
      }
    })
    
    const jsonStr = JSON.stringify(data, null, 4)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'localesHud.json'
    a.click()
    
    URL.revokeObjectURL(url)
  }
  
}
