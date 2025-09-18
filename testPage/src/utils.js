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
    
    let result
    
    if (w.length === 3) {
      result = shuffleArray([...w]).join('')
    } else {
      const chars = w.split('')
      const middle = chars.slice(1, -1)
      const shuffled = shuffleArray([...middle]).join('')
      result = chars[0] + shuffled + chars[chars.length - 1]
    }
    
    // если получилось то же самое → меняем слово пополам
    if (result === w) {
      const mid = Math.floor(w.length / 2)
      result = w.slice(mid) + w.slice(0, mid)
    }
    
    return result.charAt(0).toUpperCase() + result.slice(1)
  }
  
  return word
    .split(/([ -])/g)
    .map(chunk =>
      /[a-zA-Zа-яА-ЯёЁ]/.test(chunk) ? shuffleSingleWord(chunk) : chunk
    )
    .join('')
}
