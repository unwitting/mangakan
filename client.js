import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router'

import App from './client/app'
import Reader from './client/components/reader'

const version = window.appVersion

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <Route path=':series' component={null} />
      <Route path=':series/:chapter/:page' component={Reader} version={version} />
    </Route>
  </Router>,
  document.getElementById('react-mountpoint')
)
