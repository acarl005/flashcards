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
