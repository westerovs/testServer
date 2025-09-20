// import {fisherYatesShuffleWord} from './utils.js'

import {WordShuffler} from './utils.js'

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

  #renderRows(data) {
    data.forEach(([key, {en, ru}]) => {
      const tr = document.createElement('tr')
      const enAnagram = WordShuffler.shuffleText(en)
      const ruAnagram = WordShuffler.shuffleText(ru)

      ;[key, en, enAnagram, ru, ruAnagram].forEach(value => {
        const td = document.createElement('td')
        td.innerText = value
        tr.appendChild(td)
      })

      this.#table.appendChild(tr)
    })
  }
}
