import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Route, useParams } from 'react-router-dom'
import Category from './category'
import TaskList from './taskList'
import './home.scss'

const Home = () => {
  const [categoryList, setCategurylist] = useState([])
  const [taskList, setTaskList] = useState([])
  const { category } = useParams()
  const addCategory = (newCategory) => {
    axios.post(`/api/v1/tasks/${newCategory}`)
    setCategurylist([...categoryList, newCategory])
  }
  const updateStatus = (newStatus, id) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status: newStatus })
    const updateTaskList = taskList.map((el) =>
      el.taskId === id ? { ...el, status: newStatus } : el
    )
    setTaskList(updateTaskList)
  }
  const updateTitle = (title, id) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { title })
    const updatedTitle = taskList.map((el) => (el.taskId === id ? { ...el, title } : el))
    setTaskList(updatedTitle)
  }
  const addTask = (newTask) => {
    axios
      .post(`/api/v1/tasks/${category}`, { title: newTask })
      .then(({ data }) => setTaskList([...taskList, data.newTask]))
  }
  const timeFilter = (timespan) => {
    axios(`/api/v1/tasks/${category}/${timespan}`).then(({ data }) => setTaskList(data))
  }
  useEffect(() => {
    axios('/api/v1/categories').then(({ data }) => setCategurylist(data))
  }, [])
  useEffect(() => {
    if (typeof category !== 'undefined') {
      axios(`/api/v1/tasks/${category}`).then(({ data }) => setTaskList(data))
    }
  }, [category])
  return (
    <div className="bg-home text-xl">
      <Route
        exact
        path="/"
        component={() => <Category categoryList={categoryList} addCategory={addCategory} />}
      />
      <Route
        exact
        path="/:category"
        component={() => (
          <TaskList
            taskList={taskList}
            addTask={addTask}
            updateStatus={updateStatus}
            updateTitle={updateTitle}
            timeFilter={timeFilter}
          />
        )}
      />
    </div>
  )
}

Home.propTypes = {}

export default React.memo(Home)
