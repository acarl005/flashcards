import React, { useState } from "react"
import { Button, Icon } from "antd"

import FlashCard from "./FlashCard"
import { shuffle } from "../utils"

export default function QuizReel(props) {
  const { cards } = props
  const shuffledCards = shuffle(cards.slice())
  const [ activeCard, setActiveCard ] = useState(0)
  return <>
    <FlashCard data={shuffledCards[activeCard]} />
    <div className="quiz-buttons">
      <Button.Group>
        <Button disabled={activeCard === 0} onClick={() => setActiveCard(activeCard - 1)}>
          <Icon type="left" />
        </Button>
        <Button>
          <Icon type="redo" />
        </Button>
        <Button disabled={activeCard >= cards.length - 1} onClick={() => setActiveCard(activeCard + 1)}>
          <Icon type="right" />
        </Button>
      </Button.Group>
    </div>
  </>
}
