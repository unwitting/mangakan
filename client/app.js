import classnames from 'classnames'
import React from 'react'

import c from './app.css'
import Reader from './components/reader'

export default class App extends React.Component {

  render() {
    return (
      <div className={classnames(c.app)}>
        <Reader app={this} {...this.props} />
      </div>
    )
  }

}
