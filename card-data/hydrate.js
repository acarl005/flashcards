const fs = require("fs").promises
const request = require("request-promise")
const data = require("./data")

const url = 'https://glosbe.com/transliteration/api?from=Han&dest=Latin&format=json&text='

;(async () => {
  for (let obj of data) {
    if (!("hanzi" in obj)) {
      throw new Error(`obj has no hanzi: ${obj}`)
    }
    if ("pinyin" in obj) {
      continue
    }
    process.stdout.write(`translating ${obj.hanzi}... `)
    const response = await request({
      url: url + encodeURIComponent(obj.hanzi),
      json: true
    })
    if (response.result !== "ok") {
      throw new Error(`${response}`)
    }
    console.log(response.text)
    obj.pinyin = response.text
  }
  fs.writeFile("./data-hydrate.json", JSON.stringify(data, null, 2), "utf8")
})()
