import classnames from 'classnames'
import React from 'react'

import c from './new_furigana_blocker.css'

export default class NewFuriganaBlocker extends React.Component {

  render() {
    const left = parseFloat(this.props.left)
    const top = parseFloat(this.props.top)
    const width = parseFloat(this.props.width)
    const height = parseFloat(this.props.height)
    const grey = parseInt(this.props.grey)
    return (<div>
      {width > 0 ? <div className={classnames(c.blocker)}
        style={{
          right: `${100 - left}%`,
          bottom: 0,
          left: 0,
          top: 0,
        }}></div> : null}
      {width > 0 ? <div className={classnames(c.blocker)}
        style={{
          right: 0,
          bottom: 0,
          left: `${left + width}%`,
          top: 0,
        }}></div> : null}
      {height > 0 ? <div className={classnames(c.blocker)}
        style={{
          right: 0,
          bottom: `${100 - top}%`,
          left: 0,
          top: 0,
        }}></div> : null}
      {height > 0 ? <div className={classnames(c.blocker)}
        style={{
          right: 0,
          bottom: 0,
          left: 0,
          top: `${top + height}%`,
        }}></div> : null}
      {height > 0 && width > 0 ? <div className={classnames(c.blockerInner)}
        style={{
          backgroundColor: `rgb(${grey}, ${grey}, ${grey})`,
          right: `${100 - (left + width)}%`,
          bottom: `${100 - (top + height)}%`,
          left: `${left}%`,
          top: `${top}%`,
        }}></div> : null}
    </div>)
  }

}
