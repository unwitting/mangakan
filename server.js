const bodyParser = require('body-parser')
const colors = require('colors')
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const path = require('path')

const package = require('./package.json')

const PORT = 8000
const FURIGANA_VOTES_BASE = -10
const FURIGANA_UNPOPULAR_DROP_THRESHOLD = -2

const app = express()
nunjucks.configure({
  autoescape: true,
  express: app,
})

const getMetaCache = {}
function getMeta(series) {
  log(`Getting meta for series: ${colors.cyan(series)}`)
  const cacheKey = `getMeta-${series}`
  let meta = getMetaCache[cacheKey]
  if (!!meta) {
    log(`${colors.green('Cache hit')} for meta data`)
  } else {
    log(`${colors.red('Cache miss')} for meta data, reading from file`)
    meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'json', series, '_meta.json')))
    getMetaCache[cacheKey] = meta
  }
  // Add page info (after cache, deliberately)
  for (let chapterNum in meta.chapters) {
    meta.chapters[chapterNum].pages = getPages(series, chapterNum)
  }
  return meta
}

function genericPageServe(req, res, socialImageUrl=null) {
  const appVersion = `${package.name} v${package.version}`
  res.render('page.html', {appVersion, socialImageUrl})
}

const getPageCache = {}
function getPageCacheKill(series, chapter, page) {
  delete getPageCache[`getPage-${series}/${chapter}/${page}`]
}
function getPage(series, chapter, page) {
  log(`Getting page data for chapter ${colors.cyan(chapter)}, page ${colors.cyan(page)} of series: ${colors.cyan(series)}`)
  const cacheKey = `getPage-${series}/${chapter}/${page}`
  let data = getPageCache[cacheKey]
  if (!!data) {
    log(`${colors.green('Cache hit')} for page data`)
  } else {
    log(`${colors.red('Cache miss')} for page data, reading from file`)
    data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'json', series, `${chapter}_${page}.json`)))
    getPageCache[cacheKey] = data
  }
  data.status = (data.furiganaVotes >= 0 && !!data.vocab && !!data.vocabSegments) ? 'COMPLETE' : 'NEW'
  return data
}
function writePage(series, chapter, page, data) {
  log(`${colors.green('Writing')} new page data for chapter ${colors.cyan(chapter)}, page ${colors.cyan(page)} of series: ${colors.cyan(series)}`)
  fs.writeFileSync(path.join(__dirname, 'data', 'json', series, `${chapter}_${page}.json`), JSON.stringify(data, undefined, 2))
  getPageCacheKill()
}

const getPagesCache = {}
function getPages(series, chapter) {
  log(`Getting pages list for chapter ${colors.cyan(chapter)} of series: ${colors.cyan(series)}`)
  const cacheKey = `getPages-${series}/${chapter}`
  if (!!getPagesCache[cacheKey]) {
    log(`${colors.green('Cache hit')} for page list`)
    return getPagesCache[cacheKey]
  } else {
    log(`${colors.red('Cache miss')} for page list, reading from files`)
    const dataFiles = fs.readdirSync(path.join(__dirname, 'data', 'json', series))
    const pages = []
    for (let dataFile of dataFiles) {
      const match = dataFile.match(/^[0-9]{1,20}_([0-9]{1,20}).json$/)
      if (!!match) {
        const page = getPage(series, chapter, match[1])
        pages.push({
          status: page.status,
          chapter: page.chapter,
          page: page.page,
        })
      }
    }
    getPagesCache[cacheKey] = pages
    return pages
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
app.use(bodyParser.json())
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
app.post('/api/add_furigana/:series/:chapter/:page', (req, res) => {
  if (!validateSeriesName(req.params.series)) {
    logErr(`API request to add furigana for ${colors.cyan('page')} of ${colors.red('invalid')} series: ${colors.red(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validateChapterString(req.params.chapter)) {
    logErr(`API request to add furigana for ${colors.cyan('page')} of ${colors.red('invalid')} chapter ${colors.red(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validatePageString(req.params.page)) {
    logErr(`API request to add furigana for ${colors.red(`invalid page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  const x = req.body.left
  const y = req.body.top
  const w = req.body.width
  const h = req.body.height
  const content = req.body.content
  if (
    typeof x != 'number' || typeof y != 'number' || typeof w != 'number' || typeof h != 'number' ||
    typeof content != 'string' ||
    x < 0 || x >= 100 || y < 0 || y >= 100 || w <= 0 || w >= 100 || h <=0 || h >= 100 ||
    x + w >= 100 || y + h >= 100 ||
    content.length <= 0
  ) {
    logErr(`API request to add furigana for ${colors.cyan(`page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)} has invalid dimensions: [${x}, ${y}, ${w}, ${h}]`)
    return res.send({status: 'BAD REQUEST'})
  }
  log(`API request to add furigana for ${colors.cyan(`page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
  const page = getPage(req.params.series, req.params.chapter, req.params.page)
  if (page.furiganaVotes >= 0) {
    logErr(`${colors.red('Cannot add furigana')} since overall furigana votes are >=0`)
    return res.send({status: 'BAD REQUEST'})
  }
  page.furigana.push({
    content: content,
    color: 'rgb(0, 0, 0)',
    x, y, w, h,
    votes: 0,
  })
  log(`Rebasing furigana votes for this page to ${colors.red(FURIGANA_VOTES_BASE)} since a furigana was added`)
  page.furiganaVotes = FURIGANA_VOTES_BASE
  writePage(req.params.series, req.params.chapter, req.params.page, page)
  res.send({
    status: 'OK',
    path: req.path,
    data: {page},
  })
})
app.post('/api/approve_furigana/:series/:chapter/:page', (req, res) => {
  if (!validateSeriesName(req.params.series)) {
    logErr(`API request to approve furigana for ${colors.cyan('page')} of ${colors.red('invalid')} series: ${colors.red(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validateChapterString(req.params.chapter)) {
    logErr(`API request to approve furigana for ${colors.cyan('page')} of ${colors.red('invalid')} chapter ${colors.red(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validatePageString(req.params.page)) {
    logErr(`API request to approve furigana for ${colors.red(`invalid page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  const page = getPage(req.params.series, req.params.chapter, req.params.page)
  log(`API request to ${colors.green('approve furigana')} for ${colors.cyan(`page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
  page.furiganaVotes++
  log(`Furigana votes for this page are now at ${colors.green(page.furiganaVotes)}`)
  writePage(req.params.series, req.params.chapter, req.params.page, page)
  res.send({
    status: 'OK',
    path: req.path,
    data: {page},
  })
})
app.post('/api/vote_on_furigana/:series/:chapter/:page', (req, res) => {
  if (!validateSeriesName(req.params.series)) {
    logErr(`API request to add furigana for ${colors.cyan('page')} of ${colors.red('invalid')} series: ${colors.red(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validateChapterString(req.params.chapter)) {
    logErr(`API request to add furigana for ${colors.cyan('page')} of ${colors.red('invalid')} chapter ${colors.red(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  if (!validatePageString(req.params.page)) {
    logErr(`API request to add furigana for ${colors.red(`invalid page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
    return res.send({status: 'BAD REQUEST'})
  }
  const furiganaI = req.body.i
  const upVote = req.body.up
  const page = getPage(req.params.series, req.params.chapter, req.params.page)
  if (
    typeof upVote != 'boolean' || typeof furiganaI != 'number' ||
    furiganaI < 0 || furiganaI >= page.furigana.length
  ) {
    logErr(`API request to vote on furigana for ${colors.cyan(`page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)} has invalid arguments: [${furiganaI}, ${upVote}]`)
    return res.send({status: 'BAD REQUEST'})
  }
  log(`API request to ${upVote ? colors.green('upvote') : colors.red('downvote')} furigana ${colors.cyan(furiganaI)} for ${colors.cyan(`page ${req.params.page}`)} of chapter ${colors.cyan(req.params.chapter)} of series: ${colors.cyan(req.params.series)}`)
  if (page.furiganaVotes >= 0) {
    logErr(`${colors.red('Cannot vote on furigana')} since overall furigana votes are >=0`)
    return res.send({status: 'BAD REQUEST'})
  }
  page.furigana[furiganaI].votes += (upVote ? 1 : -1)
  if (page.furigana[furiganaI].votes < FURIGANA_UNPOPULAR_DROP_THRESHOLD) {
    page.furigana.splice(furiganaI, 1)
    log(`Rebasing furigana votes for this page to ${colors.red(FURIGANA_VOTES_BASE)} since a furigana was dropped`)
    page.furiganaVotes = FURIGANA_VOTES_BASE
  }
  writePage(req.params.series, req.params.chapter, req.params.page, page)
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

app.listen(PORT, () => {
  log(`App started, listening on port ${colors.cyan(PORT)}`)
})

log(`${colors.yellow('Prewarming')} API caches...`)
getMeta('bleach')
