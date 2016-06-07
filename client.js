import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './client/app'

const meta = JSON.parse($('<span/>').html(window.metaJson).text())
const page = JSON.parse($('<span/>').html(window.pageJson).text())
const version = window.appVersion

ReactDOM.render(<App {...{meta, page, version}}/>, document.getElementById('react-mountpoint'))
