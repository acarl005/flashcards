// this script takes the data.yml, checks all the items, and adds the pinyin if its not there
// i wanted to automate it, as it can be inferred from the hanzi. no need to duplicate work!
const path = require("path")
const fs = require("fs")
const request = require("request-promise")
const yaml = require("yaml")

const data = yaml.parse(fs.readFileSync(path.resolve(__dirname, "./data.yml"), "utf8"))
const url = 'https://glosbe.com/transliteration/api?from=Han&dest=Latin&format=json&text='

async function toPinyin(hanzi) {
  process.stdout.write(`translating ${hanzi}... `)
  const response = await request({
    url: url + encodeURIComponent(hanzi),
    json: true
  })
  if (response.result !== "ok") {
    throw new Error(`${response}`)
  }
  console.log(response.text)
  return response.text
}

;(async () => {
  for (let obj of data) {
    if (!("hanzi" in obj)) {
      throw new Error(`obj has no hanzi: ${obj}`)
    }
    if (!("pinyin" in obj)) {
      obj.pinyin = await toPinyin(obj.hanzi)
    }
    if ("sentences" in obj) {
      for (let sentence of obj.sentences) {
        if (!("pinyin" in sentence)) {
          sentence.pinyin = await toPinyin(sentence.hanzi)
        }
      }
    }
  }
  await fs.promises.writeFile("./data-hydrate.yml", yaml.stringify(data), "utf8")
})()
