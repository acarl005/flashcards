import React, { useState } from "react"
import { Card, Tag } from "antd"

export default function FlashCard(props) {
  const [ cardTouched, setCardTouched ] = useState(false)
  const frontSide = props.frontLang === "mandarin" ?
    <div className="hanzi-wrap title">
      <div className="hanzi">{props.data.hanzi}</div>
      <div className="pinyin">{props.data.pinyin}</div>
    </div> :
    <p className="translation">
      {props.data.translate}
    </p>

  const tagList = props.data.tags ?
    <div className="tag-list">
      {props.data.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
    </div> :
    null

  let sentences = null
  if (props.data.sentences) {
    const sentenceItems = props.data.sentences.map(sentence => {
      const listItems = []
      let i = 0
      const splitPinyin = sentence.pinyin.split(/\s+/)
      for (let word of sentence.hanzi.split(/\s+/)) {
        listItems.push(
          <div className="hanzi-wrap" key={i}>
            <div className="hanzi">{word}</div>
            <div className="pinyin">{splitPinyin.slice(i, i + word.length).join(" ")}</div>
          </div>
        )
        i += word.length
      }
      return <li key={sentence.hanzi}>
        {listItems}
      </li>
    })
    sentences = <div className="sentence-container">
      <ul className="sentence-list">{sentenceItems}</ul>
    </div>
  }

  const weakCheckbox = (
    <div style={{ position: "absolute", bottom: 2, right: 6 }}>
      <input type="checkbox" checked={props.data.tags.includes("Weak")} onChange={props.toggleWeakTag} />
    </div>
  )

  return <>
    <div
      className={`flip-card ${props.flipped || cardTouched ? "flipped" : ""}`}
      onTouchStart={() => setCardTouched(true)}
      onTouchEnd={() => setCardTouched(false)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <Card className="flashcard">
            <div className="card-content">
              <div className="card-item">
                {frontSide}
              </div>
            </div>
            {weakCheckbox}
          </Card>
        </div>
        <div className="flip-card-back">
          <Card className="flashcard">
            <div className="card-content">
              <div className="card-item">
                <div className="hanzi-wrap title">
                  <div className="hanzi">{props.data.hanzi}</div>
                  <div className="pinyin">{props.data.pinyin}</div>
                </div>
              </div>
              <div className="card-item">
                <p className="translation">
                  {props.data.translate}
                </p>
              </div>
              {sentences}
            </div>
            {tagList}
            {weakCheckbox}
          </Card>
        </div>
      </div>
    </div>
  </>
}

