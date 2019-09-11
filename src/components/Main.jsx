import { readFileSync } from "fs"
import React, { useState, useRef } from "react"
import { Layout, Menu, Drawer, Form, Radio, Input, Table, Icon, Button } from "antd"
import yaml from "yaml"
import debounce from "lodash.debounce"

import FlashCard from "./FlashCard"
import QuizReel from "./QuizReel"
import { shuffle, hasMatch } from "../utils"

const { Header, Content, Footer, Sider } = Layout

const data = yaml.parse(readFileSync("./card-data/data.yml", "utf8"))
window.DATA = data
let allTags = new Set
for (let obj of data) {
  if (obj.tags) {
    obj.tags.forEach(allTags.add.bind(allTags))
  }
}
allTags = Array.from(allTags).sort()

const numWithoutTags = data.reduce((count, obj) => count + !obj.tags, 0)
if (numWithoutTags > 0) {
  console.warn(`hiding ${numWithoutTags} card(s) without tags`)
}


export default function Main() {
  const [ activeView, setActiveView ] = useState("list")
  const [ shuffledCards, setShuffledCards ] = useState(data.slice())
  const [ frontLang, setFrontLang ] = useState("mandarin")
  const [ selectedTags, setSelectedTags ] = useState(new Set(allTags))
  const [ drawerOpen, setDrawerOpen ] = useState(false)
  const [ searchTerm, setSearchTerm ] = useState("")
  const searchRef = useRef(null)

  let activeComponent
  switch (activeView) {
    case "list":
      activeComponent = data
        .filter(obj => obj.tags && hasMatch(obj.tags, selectedTags))
        .filter(obj => obj.pinyin.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm) ||
                       obj.translate.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm))
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
    setSearchTerm("")
    setShuffledCards(shuffle(shuffledCards.slice()))
  }

  const tableData = allTags.map(tag => ({ key: tag, tag }))
  function onTagChange(selectedRowKeys, selectedRows) {
    setSelectedTags(new Set(selectedRowKeys))
  }

  const siderContents = <div className="sider-container">
    <Menu theme="light" mode="inline" className="main-menu">
      {
        activeView === "list" ?
          <Menu.Item key="1" onClick={() => (startQuiz(), setDrawerOpen(false))}>
            <Icon type="question-circle" />
            <span>Quiz</span>
          </Menu.Item> :
          <Menu.Item key="2" onClick={() => (setActiveView("list"), setDrawerOpen(false))}>
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
      { activeView === "list" ?
          <Form.Item>
            <Input.Search
              ref={searchRef}
              placeholder="search cards"
              onChange={debounce(() => {
                setSearchTerm(searchRef.current.input.state.value.toLowerCase())
              }, 200)}
              allowClear={true}
            />
          </Form.Item> :
          null
      }
    </Form>
    <Table
      rowSelection={{ onChange: onTagChange, selectedRowKeys: Array.from(selectedTags) }}
      columns={[{ title: "Tags", dataIndex: "tag" }]}
      dataSource={tableData}
      pagination={false}
      className="tag-table"
    />
  </div>

  return <>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" className="flashcard-sider">
        {siderContents}
      </Sider>
      <Drawer
        placement="left"
        onClose={() => setDrawerOpen(!drawerOpen)}
        visible={drawerOpen}
        width="200px"
        className="flashcard-drawer"
      >
        {siderContents}
      </Drawer>
      <Button onClick={() => setDrawerOpen(!drawerOpen)} className="drawer-button">
        <Icon type="menu-unfold" />
      </Button>
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
