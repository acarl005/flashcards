import { readFileSync } from "fs"
import React, { useState } from "react"
import { Layout, Menu, Form, Radio, Table, Icon } from "antd"
import yaml from "yaml"

import FlashCard from "./FlashCard"
import QuizReel from "./QuizReel"
import { shuffle, hasMatch } from "../utils"

const { Header, Content, Footer, Sider } = Layout

const data = yaml.parse(readFileSync("./card-data/data.yml", "utf8"))
let allTags = new Set
for (let obj of data) {
  if (obj.tags) {
    obj.tags.forEach(allTags.add.bind(allTags))
  }
}
allTags = Array.from(allTags).sort()


export default function Main() {
  const [ activeView, setActiveView ] = useState("list")
  const [ shuffledCards, setShuffledCards ] = useState(data.slice())
  const [ frontLang, setFrontLang ] = useState("mandarin")
  const [ selectedTags, setSelectedTags ] = useState(new Set(allTags))
  let activeComponent
  switch (activeView) {
    case "list":
      activeComponent = data
        .filter(obj => obj.tags && hasMatch(obj.tags, selectedTags))
        .map(obj => <FlashCard data={obj} key={obj.hanzi} frontLang={frontLang} />)
      break;
    case "quiz":
      activeComponent = <QuizReel
        cards={shuffledCards.filter(obj => obj.tags && hasMatch(obj.tags, selectedTags))}
        frontLang={frontLang}
      />
      break;
    default:
      throw new Error(`unknown view: ${activeView}`)
  }

  function startQuiz() {
    setActiveView("quiz")
    setShuffledCards(shuffle(shuffledCards.slice()))
  }

  const tableData = allTags.map(tag => ({ key: tag, tag }))
  function onTagChange(selectedRowKeys, selectedRows) {
    setSelectedTags(new Set(selectedRowKeys))
  }

  return <>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width="200px">
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
        <Form layout="vertical" className="sider-menu">
          <Form.Item label="Front side">
            <Radio.Group onChange={e => setFrontLang(e.target.value)} value={frontLang}>
              <Radio value="mandarin">中文</Radio>
              <Radio value="english">English</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <Table
          rowSelection={{ onChange: onTagChange, selectedRowKeys: Array.from(selectedTags) }}
          columns={[{ title: "Tags", dataIndex: "tag" }]}
          dataSource={tableData}
          pagination={false}
        />
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
