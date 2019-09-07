import { readFileSync } from "fs"
import React, { useState } from "react"
import { Layout, Menu, Form, Radio, Icon } from "antd"
import yaml from "yaml"

import FlashCard from "./FlashCard"
import QuizReel from "./QuizReel"
import { shuffle } from "../utils"

const data = yaml.parse(readFileSync("./card-data/data.yml", "utf8"))
const { Header, Content, Footer, Sider } = Layout


export default function Main() {
  const [ activeView, setActiveView ] = useState("list")
  const [ shuffledCards, setShuffledCards ] = useState(data.slice())
  const [ frontLang, setFrontLang ] = useState("mandarin")
  let activeComponent
  switch (activeView) {
    case "list":
      activeComponent = data.map(obj => <FlashCard data={obj} key={obj.hanzi} frontLang={frontLang} />)
      break;
    case "quiz":
      activeComponent = <QuizReel cards={shuffledCards} frontLang={frontLang} />
      break;
    default:
      throw new Error(`unknown view: ${activeView}`)
  }

  function startQuiz() {
    setActiveView("quiz")
    setShuffledCards(shuffle(shuffledCards.slice()))
  }

  return <>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <Menu theme="light" mode="inline" className="main-menu">
          {
            activeView === "list" ?
              <Menu.Item key="1" onClick={startQuiz}>
                <Icon type="question-circle" />
                <span>Quiz</span>
              </Menu.Item> :
              <Menu.Item key="2" onClick={() => setActiveView("list")}>
                <Icon type="switcher" />
                <span>All</span>
              </Menu.Item>
          }
        </Menu>
        <Form layout="vertical">
          <Form.Item label="Front side">
            <Radio.Group onChange={e => setFrontLang(e.target.value)} value={frontLang}>
              <Radio value="mandarin" style={{ display: "block" }}>中文</Radio>
              <Radio value="english" style={{ display: "block" }}>English</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Sider>
      <Layout className="content">
        <Content className="content-display">
          <div className="content-wrap">
            {activeComponent}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Andy Carlson ©2019</Footer>
      </Layout>
    </Layout>
  </>
}
