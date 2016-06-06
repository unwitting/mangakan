const express = require('express')
const nunjucks = require('nunjucks')

const PORT = 8000
const app = express()
nunjucks.configure({
  autoescape: true,
  express: app,
})

function getMeta(series) {
  return require(`./data/json/${series}/_meta.json`)
}

function getPage(series, chapter, page) {
  return require(`./data/json/${series}/${chapter}_${page}.json`)
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} (${new Date().toISOString()})`)
  next()
})
app.use('/static', express.static('static'))
app.use('/data', express.static('data'))
app.get('/', (req, res) => {
  const meta = getMeta('bleach')
  const metaJson = JSON.stringify(meta)
  const page = getPage('bleach', 1, 1)
  const pageJson = JSON.stringify(page)
  res.render('page.html', {meta, metaJson, page, pageJson})
})

app.listen(PORT, () => {
  console.log(`App started, listening on ${PORT}`)
})
