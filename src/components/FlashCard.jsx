import React from "react"
import { Card } from "antd"

export default function FlashCard(props) {
  return <>
    <div className={`flip-card ${props.flipped ? "flipped" : ""}`}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <Card className="flashcard">
            <div className="card-content">
              <div className="card-item">
                <div className="hanzi-wrap">
                  <div className="hanzi">{props.data.hanzi}</div>
                  <div className="pinyin">{props.data.pinyin}</div>
                </div>
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
                {props.data.translate}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </>
}

