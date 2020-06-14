import React, { useState } from 'react'
import TaskItem from './taskItem'

const TaskList = (props) => {
  const [newTask, setNewTask] = useState()
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-300 p-2  rounded">
        <div className="inline flex justify-center p-1">
          <button
            className="bg-gray-500 p-1 m-2 rounded"
            type="button"
            onClick={() => props.timeFilter('all')}
          >
            All
          </button>
          <button
            className="bg-gray-500 p-1 m-2 rounded "
            type="button"
            onClick={() => props.timeFilter('month')}
          >
            month
          </button>
          <button
            className="bg-gray-500 p-1 m-2 rounded"
            type="button"
            onClick={() => props.timeFilter('week')}
          >
            Week
          </button>
          <button
            className="bg-gray-500 p-1 m-2 rounded"
            type="button"
            onClick={() => props.timeFilter('day')}
          >
            Day
          </button>
        </div>
        <ul>
          {props.taskList.map((el) => (
            <li key={el.taskId}>
              <TaskItem
                taskId={el.taskId}
                title={el.title}
                status={el.status}
                updateStatus={props.updateStatus}
                updateTitle={props.updateTitle}
              />
            </li>
          ))}
        </ul>

        <input
          className=" p-1 rounded"
          placeholder="Add task"
          type="text"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-gray-500 p-1 rounded"
          type="button"
          onClick={() => props.addTask(newTask)}
        >
          GO
        </button>
      </div>
    </div>
  )
}

TaskList.propTypes = {}

export default React.memo(TaskList)
