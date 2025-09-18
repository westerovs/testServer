export const ANAGRAM_EXCLUSIONS = {
  'dog': 'odg', // вместо God
  'top': 'otp',  // вместо Pot
  'лак': 'лка'
}

// Fisher–Yates перемешивание слова или фразы
export const fisherYatesShuffleWord = word => {
  if (!word || word.length <= 2) return word
  
  const shuffleArray = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
  
  const shuffleSingleWord = w => {
    if (w.length <= 2) return w
    
    // 🛡️ Проверяем ручные исключения
    const lower = w.toLowerCase()
    if (ANAGRAM_EXCLUSIONS[lower]) {
      return ANAGRAM_EXCLUSIONS[lower]
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
  
  // вспомогательная функция: делает заглавной первую букву в строке
  const capitalizeFirstAlpha = s => {
    const i = s.search(/[A-Za-zА-Яа-яЁё]/)
    return i === -1 ? s : s.slice(0, i) + s[i].toUpperCase() + s.slice(i + 1)
  }
  
  let firstWordDone = false
  
  return word
    .split(/([ -])/g) // разбиваем по пробелам и дефисам (сохраняя их)
    .map(chunk => {
      if (!/[A-Za-zА-Яа-яЁё]/.test(chunk)) return chunk
      
      const shuffled = shuffleSingleWord(chunk)
      
      // 👉 первая буква только у первого слова делается заглавной
      if (!firstWordDone) {
        firstWordDone = true
        return capitalizeFirstAlpha(shuffled)
      }
      
      // 👉 все остальные слова без заглавной буквы
      return shuffled
    })
    .join('')
}
