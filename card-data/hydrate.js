// this script takes the data.yml, checks all the items, and adds the pinyin if its not there
// i wanted to automate it, as it can be inferred from the hanzi. no need to duplicate work!
const path = require("path")
const fs = require("fs")
const request = require("request-promise")
const yaml = require("yaml")

const data = yaml.parse(fs.readFileSync(path.resolve(__dirname, "./data.yml"), "utf8"))
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
  await fs.promises.writeFile("./data-hydrate.yml", yaml.stringify(data), "utf8")
})()
