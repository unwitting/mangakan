import classnames from 'classnames'
import React from 'react'

import c from './app.css'
import Reader from './components/reader'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editMode: true,
      metaData: props.meta,
      pageData: props.page,
    }
  }

  toggleEditMode() {
    this.setState({editMode: !this.state.editMode})
  }

  render() {
    return (
      <div className={classnames(c.app)}>
        <Reader app={this} meta={this.state.metaData} page={this.state.pageData} />
      </div>
    )
  }

}
