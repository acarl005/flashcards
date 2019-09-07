import { readFileSync } from "fs"
import React, { useState } from "react"
import { Layout, Menu, Icon } from "antd"
import yaml from "yaml"

import FlashCard from "./FlashCard"
import QuizReel from "./QuizReel"

const data = yaml.parse(readFileSync("./card-data/data.yml", "utf8"))
const { Header, Content, Footer, Sider } = Layout


export default function Main() {
  const [ activeView, setActiveView ] = useState("quiz")
  let activeComponent
  switch (activeView) {
    case "list":
      activeComponent = data.map(obj => <FlashCard data={obj} key={obj.hanzi} />)
      break;
    case "quiz":
      activeComponent = <QuizReel cards={data} />
      break;
    default:
      throw new Error(`unknown view: ${activeView}`)
  }

  function startQuiz() {
    setActiveView("quiz")
  }

  return <>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div className="logo" />
        <Menu theme="light" mode="inline">
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
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {activeComponent}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Andy Carlson ©2019</Footer>
      </Layout>
    </Layout>
  </>
}
