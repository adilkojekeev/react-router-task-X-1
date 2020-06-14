/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import shortid from 'shortid'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const port = process.env.PORT || 3000
const server = express()
const { readdirSync } = require('fs')
const { readFile, writeFile } = require('fs').promises

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
)
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

const wrFile = async (category, newTasks) => {
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(newTasks), {
    encoding: 'utf8'
  })
}

const readingFile = async (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then(
      (data) => {
        return JSON.parse(data)
      } /* вернется текст, а не объект джаваскрипта */
    )
    .catch(() => [])
}
const getTasks = (tasks) => {
  return tasks.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}
server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = getTasks(await readingFile(category))
  res.json(tasks)
})
server.get('/api/v1/categories', async (req, res) => {
  const categoryList = readdirSync(`${__dirname}/tasks/`).map((el) => el.split('.json')[0])
  res.send(categoryList)
})
server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const periodOfTime = {
    day: 1000 * 60 * 60 * 24,
    week: 7 * 1000 * 60 * 60 * 24,
    month: 30 * 1000 * 60 * 60 * 24,
    all: +new Date()
  }
  const tasks = await readingFile(category)
  const filteredTasks = getTasks(
    // eslint-disable-next-line no-underscore-dangle
    tasks.filter((el) => el._createdAt + periodOfTime[timespan] > +new Date())
  )
  res.json(filteredTasks)
})
server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  if (Object.keys(req.body).length === 0) {
    const newTask = []
    await wrFile(category, newTask)
    res.json({ status: 'category added', newTask })
  } else {
    const tasks = await readingFile(category)
    const newTask = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const newTasks = [...tasks, newTask]
    await wrFile(category, newTasks)
    res.json({ status: 'success', newTask })
  }
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { id, category } = req.params
  const newStatus = req.body
  const statuses = ['new', 'in progress', 'done', 'bloked']
  if (!statuses.includes(newStatus.status) && newStatus.title === undefined) {
    res.status(501)
    res.json({ status: 'error', massage: 'incorrect status' })
  } else {
    const tasks = await readingFile(category)
    const newTasksList = tasks.map((el) => (el.taskId === id ? { ...el, ...newStatus } : el))
    const updatedTask = getTasks(newTasksList).reduce((acc, rec) => {
      if (rec.taskId === id) {
        return { ...rec }
      }
      return acc
    })
    await wrFile(category, newTasksList)
    res.json(updatedTask)
  }
}) // или можно вторым методом через фильтер  const updatedTask = getTasks(newTasksList.filter((el) => el.taskId === id)) и res.json(updatedTask) вставить три точки

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { id, category } = req.params
  const tasks = await readingFile(category)
  const newTasksList = tasks.map((el) => (el.taskId === id ? { ...el, _isDeleted: true } : el))
  await wrFile(category, newTasksList)
  res.json({ status: 'delete succsessfully' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
