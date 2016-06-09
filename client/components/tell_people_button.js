import classnames from 'classnames'
import React from 'react'

import c from './tell_people_button.css'

export default class TellPeopleButton extends React.Component {

  handleClick() {
    this.props.app.showTellPeopleOverlay()
  }

  render() {

    return (
      <button className={classnames(c.button)} onClick={this.handleClick.bind(this)}>
        Tell people about Mangakan!
      </button>
    )
  }

}
