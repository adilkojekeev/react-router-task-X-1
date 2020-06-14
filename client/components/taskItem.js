import React, { useState } from 'react'

const TaskItem = (props) => {
  const [editMode, setEditMod] = useState(false)
  const [taskName, setTaskName] = useState(props.title)
  return (
    <div className="inline flex justify-between p-1">
      {editMode ? (
        <span>
          <button
            type="button"
            className="bg-green-500 m-1 rounded p-1"
            onClick={() => props.updateTitle(taskName, props.taskId)}
          >
            Save
          </button>
          <input
            type="text"
            className="bg-grey-200 rounded p-1"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </span>
      ) : (
        <span>
          <button
            type="button"
            className="bg-green-500 m-1 p-1 rounded"
            onClick={() => setEditMod(true)}
          >
            Edit
          </button>
        </span>
      )}
      {props.title}
      {props.status === 'new' ? (
        <button
          type="button"
          className="bg-green-500 m-1 p-1 rounded"
          onClick={() => props.updateStatus('in progress', props.taskId)}
        >
          In progress
        </button>
      ) : (
        ''
      )}
      {props.status === 'in progress' ? (
        <div className="inline">
          <button
            type="button"
            className="bg-green-500 m-1 p-1 rounded"
            onClick={() => props.updateStatus('blocked', props.taskId)}
          >
            Block
          </button>
          <button
            type="button"
            className="bg-green-500 m-1 p-1 rounded"
            onClick={() => props.updateStatus('done', props.taskId)}
          >
            Done
          </button>
        </div>
      ) : (
        ''
      )}
      {props.status === 'blocked' ? (
        <button
          type="button"
          className="bg-green-500 m-1 p-1 rounded"
          onClick={() => props.updateStatus('new', props.taskId)}
        >
          block
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

export default TaskItem
