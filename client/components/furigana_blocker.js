import classnames from 'classnames'
import React from 'react'

import c from './furigana_blocker.css'

export default class FuriganaBlocker extends React.Component {

  render() {
    return (
      <div
        className={classnames(c.furiganaBlocker, {[c.hidden]: !this.props.reader.state.furiganaShown})}
        style={{
          backgroundColor: this.props.highlighted ? 'rgba(255, 0, 0, 0.5)' : this.props.furigana.color,
          border: this.props.highlighted ? '2px solid rgb(255, 0, 0)' : null,
          width: `${this.props.furigana.w}%`,
          height: `${this.props.furigana.h}%`,
          left: `${this.props.furigana.x}%`,
          top: `${this.props.furigana.y}%`,
        }}>
      </div>
    )
  }

}
