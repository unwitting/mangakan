const colors = require('colors')
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const path = require('path')

const package = require('./package.json')

const PORT = 8000
const app = express()
nunjucks.configure({
  autoescape: true,
  express: app,
})

const getMetaCache = {}
function getMeta(series) {
  log(`Getting meta for series: ${colors.cyan(series)}`)
  const cacheKey = `${series}`
  if (!!getMetaCache[cacheKey]) {
    log(`${colors.green('Cache hit')} for meta data`)
    return getMetaCache[cacheKey]
  } else {
    log(`${colors.red('Cache miss')} for meta data, reading from file`)
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'json', series, '_meta.json')))
    getMetaCache[cacheKey] = data
    return data
  }
}

function genericPageServe(req, res) {
  const appVersion = `${package.name} v${package.version}`
  res.render('page.html', {appVersion})
}

const getPageCache = {}
function getPage(series, chapter, page) {
  log(`Getting page data chapter ${colors.cyan(chapter)}, page ${colors.cyan(page)} of series: ${colors.cyan(series)}`)
  const cacheKey = `${series}/${chapter}/${page}`
  if (!!getPageCache[cacheKey]) {
    log(`${colors.green('Cache hit')} for page data`)
    return getPageCache[cacheKey]
  } else {
    log(`${colors.red('Cache miss')} for page data, reading from file`)
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'json', series, `${chapter}_${page}.json`)))
    getPageCache[cacheKey] = data
    return data
  }
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
app.get('/api/:series', (req, res) => {
  log(`API request for ${colors.cyan('metadata')} on series: ${colors.cyan(req.params.series)}`)
  const meta = getMeta(req.params.series)
  res.send({
    status: 'OK',
    path: req.path,
    data: {meta},
  })
})
app.get('/api/:series/:chapter/:page', (req, res) => {
  log(`API request for ${colors.cyan(`page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
  const page = getPage(req.params.series, req.params.chapter, req.params.page)
  res.send({
    status: 'OK',
    path: req.path,
    data: {page},
  })
})

// Routing is handled by react router, so just serve the same template to any
// of these
// app.get('/:series', genericPageServe)
app.get('/:series/:chapter/:page', genericPageServe)

app.listen(PORT, () => log(`App started, listening on port ${colors.cyan(PORT)}`))
