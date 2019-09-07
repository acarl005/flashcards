import React, { useState, useEffect } from "react"
import { Button, Icon, Tooltip, Empty } from "antd"

import FlashCard from "./FlashCard"

export default function QuizReel(props) {
  const { cards } = props
  let [ activeCard, setActiveCard ] = useState(0)
  const [ cardFlipped, setCardFlipped ] = useState(false)
  activeCard = Math.min(cards.length - 1, activeCard)

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
    { cards.length ?
        <FlashCard data={cards[activeCard]} flipped={cardFlipped} frontLang={props.frontLang} /> :
        <Empty />
    }
    <div>
      {activeCard + 1} / {cards.length}
    </div>
    <div className="quiz-buttons">
      <Button.Group>
        <Tooltip title="previous (left arrow key)" placement="bottom">
          <Button disabled={activeCard <= 0} onClick={() => setActiveCard(activeCard - 1)}>
            <Icon type="left" />
          </Button>
        </Tooltip>
        <Tooltip title="flip (up/down arrow key)" placement="bottom">
          <Button disabled={activeCard < 0} onClick={() => setCardFlipped(!cardFlipped)}>
            <Icon type="redo" />
          </Button>
        </Tooltip>
        <Tooltip title="next (right arrow key)" placement="bottom">
          <Button disabled={activeCard >= cards.length - 1} onClick={() => setActiveCard(activeCard + 1)}>
            <Icon type="right" />
          </Button>
        </Tooltip>
      </Button.Group>
    </div>
  </>
}
