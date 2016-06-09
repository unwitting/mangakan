const colors = require('colors')
const express = require('express')
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const package = require('./package.json')

const PORT = 8000
const app = express()
nunjucks.configure({
  autoescape: true,
  express: app,
})

function getMeta(series) {
  log(`Getting meta for series: ${colors.cyan(series)}`)
  return require(`./data/json/${series}/_meta.json`)
}

function getPage(series, chapter, page) {
  log(`Getting page data chapter ${colors.cyan(chapter)}, page ${colors.cyan(page)} of series: ${colors.cyan(series)}`)
  return require(`./data/json/${series}/${chapter}_${page}.json`)
}

function log(s) {
  console.log(`${colors.green(new Date().toISOString())}: ${s}`)
}
function logErr(s) {
  console.error(`${colors.red(new Date().toISOString())}: ${s}`)
}

app.use(morgan('dev'))
app.use('/static', express.static('static'))
app.use('/data', express.static('data'))
app.get('/', (req, res) => {
  logErr(`Route ${colors.cyan(`'/'`)} has no handler yet, redirecting to sample ${colors.cyan(`'/bleach/1/1'`)}`)
  res.redirect('/bleach/1/1')
})
app.get('/:series/:chapter/:page', (req, res) => {
  const meta = getMeta(req.params.series)
  const metaJson = JSON.stringify(meta)
  const page = getPage(req.params.series, req.params.chapter, req.params.page)
  const pageJson = JSON.stringify(page)
  const appVersion = `${package.name} v${package.version}`
  res.render('page.html', {meta, metaJson, page, pageJson, appVersion})
})

app.listen(PORT, () => log(`App started, listening on port ${colors.cyan(PORT)}`))
