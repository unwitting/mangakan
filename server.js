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
  const cacheKey = `getMeta-${series}`
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

function genericPageServe(req, res, socialImageUrl=null) {
  const appVersion = `${package.name} v${package.version}`
  res.render('page.html', {appVersion, socialImageUrl})
}

const getPageCache = {}
function getPage(series, chapter, page) {
  log(`Getting page data chapter ${colors.cyan(chapter)}, page ${colors.cyan(page)} of series: ${colors.cyan(series)}`)
  const cacheKey = `getPage-${series}/${chapter}/${page}`
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

function validatePageString(page) {
  return /^[0-9]{1,20}$/.test(page)
}
function validateChapterString(chapter) {
  return /^[0-9]{1,20}$/.test(chapter)
}
function validateSeriesName(series) {
  return /^[a-z0-9_]{1,20}$/.test(series)
}

app.use(morgan('dev'))
app.use('/static', express.static('static'))
app.use('/data', express.static('data'))
app.get('/', (req, res) => {
  logErr(`Route ${colors.cyan(`'/'`)} has no handler yet, redirecting to sample ${colors.cyan(`'/bleach/1/1'`)}`)
  res.redirect('/bleach/1/1')
})
app.get('/api/:series', (req, res) => {
  if (!validateSeriesName(req.params.series)) {
    logErr(`API request for ${colors.cyan('metadata')} on ${colors.red('invalid')} series: ${colors.red(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  log(`API request for ${colors.cyan('metadata')} on series: ${colors.cyan(req.params.series)}`)
  const meta = getMeta(req.params.series)
  res.send({
    status: 'OK',
    path: req.path,
    data: {meta},
  })
})
app.get('/api/:series/:chapter/:page', (req, res) => {
  if (!validateSeriesName(req.params.series)) {
    logErr(`API request for ${colors.cyan('page')} of ${colors.red('invalid')} series: ${colors.red(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validateChapterString(req.params.chapter)) {
    logErr(`API request for ${colors.cyan('page')} of ${colors.red('invalid')} chapter ${colors.red(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validatePageString(req.params.page)) {
    logErr(`API request for ${colors.red(`invalid page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
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
app.get('/:series', genericPageServe)
app.get('/:series/:chapter/:page', (req, res) => {
  genericPageServe(req, res, `http://mangakan.unwttng.com/data/images/${req.params.series}/${req.params.chapter}_${req.params.page}.jpg`)
})

app.listen(PORT, () => log(`App started, listening on port ${colors.cyan(PORT)}`))
