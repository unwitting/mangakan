import classnames from 'classnames'
import React from 'react'

import c from './furigana_toggler.css'

export default class FuriganaToggler extends React.Component {

  handleClick() {
    this.props.reader.setState({furiganaShown: !this.props.reader.state.furiganaShown})
  }

  render() {
    const shown = this.props.reader.state.furiganaShown
    return (
      <button className={classnames(c.furiganaToggler)} onClick={this.handleClick.bind(this)}>
        {shown ? 'Hide' : 'Show'} furigana
      </button>
    )
  }

}
