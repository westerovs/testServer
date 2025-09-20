export const ANAGRAM_EXCLUSIONS = {
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

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const shuffleSingleWord = (w) => {
  if (w.length <= 2) return w
  
  // 🛡️ Проверяем ручные исключения
  const lower = w.toLowerCase()
  // 🛡️ Сначала точное совпадение
  if (ANAGRAM_EXCLUSIONS[lower]) {
    return ANAGRAM_EXCLUSIONS[lower]
  }
  
  // 🛡️ Затем поиск подстрочных совпадений
  for (const [bad, safe] of Object.entries(ANAGRAM_EXCLUSIONS)) {
    if (lower.includes(bad)) {
      return lower.replace(bad, safe)
    }
  }
  
  let result
  if (w.length === 3) {
    result = shuffleArray([...w]).join('')
  } else {
    const chars = w.split('')
    const middle = chars.slice(1, -1)
    const shuffled = shuffleArray([...middle]).join('')
    result = chars[0] + shuffled + chars[chars.length - 1]
  }
  
  // если результат совпал с исходным → разрезаем пополам и меняем части
  if (result === w) {
    const mid = Math.floor(w.length / 2)
    result = w.slice(mid) + w.slice(0, mid)
  }
  
  return result
}

const capitalizeFirstLetter = (original, shuffled) => {
  const first = [...original].find(ch => /[A-Za-zА-Яа-яЁё]/.test(ch))
  if (!first) return shuffled
  
  const target = first.toLocaleLowerCase()
  const chars = [...shuffled]
  const idx = chars.findIndex(ch => ch.toLocaleLowerCase() === target)
  if (idx === -1) return shuffled
  
  chars[idx] = chars[idx].toLocaleUpperCase()
  return chars.join('')
}


// Fisher–Yates перемешивание слова или фразы
export const fisherYatesShuffleWord = word => {
  if (!word || word.length <= 2) return word
  
  let firstWordDone = false
  
  return word
    .split(/([ -])/g) // разбиваем по пробелам и дефисам (сохраняя их)
    .map(chunk => {
      if (!/[A-Za-zА-Яа-яЁё]/.test(chunk)) return chunk
      
      const shuffled = shuffleSingleWord(chunk)
      
      if (!firstWordDone) {
        firstWordDone = true
        return capitalizeFirstLetter(chunk, shuffled)
      }
      
      return shuffled
    })
    .join('')
}
