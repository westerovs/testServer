export const EXCLUSIONS = {
  'dog': 'odg', // вместо God
  'top': 'otp',  // вместо Pot
  'лак': 'лка',
  
  // английские матерные и нежелательные
  'god': 'ogd',
  'ass': 'sas',
  'sex': 'sxe',
  'xxx': 'xxz',
  'fag': 'fga',
  'fuk': 'fku',
  'fuc': 'fcu',
  'fck': 'fkc',
  'cum': 'cmu',
  'dic': 'dci',
  'dck': 'dkc',
  'tit': 'tti',
  'pus': 'psu',
  'cok': 'cko',
  'coc': 'cco',
  'nig': 'ngi',
  'slut': 'sult',
  'whore': 'wohre',
  'rape': 'reap',
  'blet': 'telb',
  
  // русские матерные и нежелательные
  'хуй': 'йух',
  'пиз': 'зпи',
  'пид': 'дпи',
  'еба': 'бея',
  'ёба': 'бёа',
  'ганд': 'нгад',
  'сука': 'скау',
  'шлюх': 'люшх',
  'дроч': 'рочд',
  'бляд': 'лядб',
  'залуп': 'лузап',
  'мраз': 'зрам',
  'чмо': 'моч',
  'жоп': 'пож',
  'говн': 'вонг',
  'хуес': 'ехус',
  'пидр': 'ирпд',
  'серьги': 'сегирь',
  'духи': 'ухид',
  'пазл': 'азпл',
  'гантель': 'тельган',
  'чемодан': 'дачемно',
  'еб': 'бе',
  'ёб': 'бё',
}

export class WordShuffler {
  static #lettersRegex = /[A-Za-zА-Яа-яЁё]/
  static #firstWordHandled = false
  
  static shuffleArray(array) {
    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
      const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
    return array
  }
  
  static shuffleSingleWord(word) {
    if (word.length <= 2) return word
    
    const lowerCaseWord = word.toLowerCase()
    if (EXCLUSIONS[lowerCaseWord]) return EXCLUSIONS[lowerCaseWord]
    
    for (const [excluded, replacement] of Object.entries(EXCLUSIONS)) {
      if (lowerCaseWord.includes(excluded)) {
        return lowerCaseWord.replace(excluded, replacement)
      }
    }
    
    let shuffledWord
    if (word.length === 3) {
      shuffledWord = this.shuffleArray([...word]).join('')
    } else {
      const characters = word.split('')
      const middleCharacters = characters.slice(1, -1)
      const shuffledMiddle = this.shuffleArray([...middleCharacters]).join('')
      shuffledWord = characters[0] + shuffledMiddle + characters[characters.length - 1]
    }
    
    if (shuffledWord === word) {
      const halfIndex = Math.floor(word.length / 2)
      shuffledWord = word.slice(halfIndex) + word.slice(0, halfIndex)
    }
    
    return shuffledWord
  }
  
  static capitalizeFirstLetter(originalWord, shuffledWord) {
    const firstLetter = [...originalWord].find(ch => this.#lettersRegex.test(ch))
    if (!firstLetter) return shuffledWord
    
    const targetLetter = firstLetter.toLocaleLowerCase()
    const characters = [...shuffledWord]
    const targetIndex = characters.findIndex(ch => ch.toLocaleLowerCase() === targetLetter)
    if (targetIndex === -1) return shuffledWord
    
    characters[targetIndex] = characters[targetIndex].toLocaleUpperCase()
    return characters.join('')
  }
  
  static transformChunk(chunk) {
    if (!this.#lettersRegex.test(chunk)) return chunk
    
    const shuffledChunk = this.shuffleSingleWord(chunk)
    
    if (!this.#firstWordHandled) {
      this.#firstWordHandled = true
      return this.capitalizeFirstLetter(chunk, shuffledChunk)
    }
    
    return shuffledChunk
  }
  
  static shuffleText(text) {
    if (!text || text.length <= 2) return text
    
    this.#firstWordHandled = false
    
    return text
      .split(/([ -])/g)
      .map(chunk => this.transformChunk(chunk))
      .join('')
  }
}

