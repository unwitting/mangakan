import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './client/app'

const meta = JSON.parse($('<span/>').html(window.metaJson).text())
const page = JSON.parse($('<span/>').html(window.pageJson).text())

ReactDOM.render(<App {...{meta, page}}/>, document.getElementById('react-mountpoint'))
