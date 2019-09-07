import React from "react"
import { Card } from "antd"

export default function FlashCard(props) {
  const frontSide = props.frontLang === "mandarin" ?
    <div className="hanzi-wrap">
      <div className="hanzi">{props.data.hanzi}</div>
      <div className="pinyin">{props.data.pinyin}</div>
    </div> :
    <p className="translation">
      {props.data.translate}
    </p>
  return <>
    <div className={`flip-card ${props.flipped ? "flipped" : ""}`}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <Card className="flashcard">
            <div className="card-content">
              <div className="card-item">
                {frontSide}
              </div>
            </div>
          </Card>
        </div>
        <div className="flip-card-back">
          <Card className="flashcard">
            <div className="card-content">
              <div className="card-item">
                <div className="hanzi-wrap">
                  <div className="hanzi">{props.data.hanzi}</div>
                  <div className="pinyin">{props.data.pinyin}</div>
                </div>
              </div>
              <div className="card-item">
                <p className="translation">
                  {props.data.translate}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </>
}

