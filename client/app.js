import classnames from 'classnames'
import React from 'react'

import c from './app.css'
import Reader from './components/reader'
import TellPeopleOverlay from './components/tell_people_overlay'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      showingTellPeopleOverlay: false,
      metaData: props.meta,
      pageData: props.page,
    }
  }

  hideTellPeopleOverlay() {
    this.setState({showingTellPeopleOverlay: false})
  }

  showTellPeopleOverlay() {
    this.setState({showingTellPeopleOverlay: true})
  }

  toggleEditMode() {
    this.setState({editMode: !this.state.editMode})
  }

  render() {
    return (
      <div className={classnames(c.app)}>
        {this.props.children}
      </div>
    )
  }

}
