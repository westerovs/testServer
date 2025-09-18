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

    let result = w
    let attempts = 0

    while (result === w && attempts < 5) {
      if (w.length === 3) {
        result = shuffleArray(w.split('')).join('')
      } else {
        const chars = w.split('')
        const middle = chars.slice(1, -1)
        const shuffled = shuffleArray([...middle]).join('')
        result = chars[0] + shuffled + chars[chars.length - 1]
      }
      attempts++
    }

    // Делаем первую букву заглавной
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  return word
    .split(/([ -])/g) // разбиваем с сохранением пробелов и дефисов
    .map(chunk =>
      /[a-zA-Zа-яА-ЯёЁ]/.test(chunk) ? shuffleSingleWord(chunk) : chunk
    )
    .join('')
}
