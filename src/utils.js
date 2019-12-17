import { useState } from "react"
import { cloneDeep } from "lodash"


export function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  // its mutated but return the reference anyways
  return array
}

export function hasMatch(cardTags, selectedTags) {
  return cardTags.reduce((anyMatch, tag) => anyMatch || selectedTags.has(tag), false)
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  const setValue = value => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue]
}


export function addWeakTags(rawData, weakCards) {
  const data = cloneDeep(rawData)
  for (let obj of data) {
    if (obj.hanzi in weakCards) {
      obj.tags.push("Weak")
    }
  }
  return data
}
