import React, { useState, useEffect } from "react"
import { Button, Icon } from "antd"

import FlashCard from "./FlashCard"

export default function QuizReel(props) {
  const { cards } = props
  const [ activeCard, setActiveCard ] = useState(0)
  const [ cardFlipped, setCardFlipped ] = useState(false)

  useEffect(() => {
    function arrowHandler(e) {
      switch (e.key) {
        case "ArrowLeft":
          setActiveCard(Math.max(activeCard - 1, 0))
          break;
        case "ArrowRight":
          setActiveCard(Math.min(activeCard + 1, cards.length - 1))
          break;
        case "ArrowDown":
        case "ArrowUp":
          setCardFlipped(!cardFlipped)
          break;
      }
    }
    window.addEventListener("keydown", arrowHandler)
    return () => {
      window.removeEventListener("keydown", arrowHandler)
    }
  })

  return <>
    <FlashCard data={cards[activeCard]} flipped={cardFlipped} frontLang={props.frontLang} />
    <div className="quiz-buttons">
      <Button.Group>
        <Button disabled={activeCard === 0} onClick={() => setActiveCard(activeCard - 1)}>
          <Icon type="left" />
        </Button>
        <Button onClick={() => setCardFlipped(!cardFlipped)}>
          <Icon type="redo" />
        </Button>
        <Button disabled={activeCard >= cards.length - 1} onClick={() => setActiveCard(activeCard + 1)}>
          <Icon type="right" />
        </Button>
      </Button.Group>
    </div>
  </>
}
