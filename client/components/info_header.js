import classnames from 'classnames'
import React from 'react'

import c from './info_header.css'

export default class InfoHeader extends React.Component {

  handleEditButtonClick() {
    this.props.app.toggleEditMode()
  }

  render() {
    const meta = this.props.meta
    const page = this.props.page
    const editMode = this.props.app.state.editMode
    return (
      <div className={classnames(c.infoHeader)}>

        <h1 className={classnames(c.header, c.seriesTitle)}>
          {meta.title.en}
          <span className={classnames(c.subJp)}>{meta.title.jp.common}</span>
        </h1>

        <h2 className={classnames(c.header, c.chapterTitle)}>
          Chapter {page.chapter}: {meta.chapters[page.chapter].title.en}
          <span className={classnames(c.subJp)}>{meta.chapters[page.chapter].title.jp.common}</span>
        </h2>

        <h2 className={classnames(c.header, c.pageTitle)}>
          Page {page.page}
          <button className={classnames(c.subControl)} onClick={this.handleEditButtonClick.bind(this)}>
            {editMode ? 'View mode' : 'Edit mode'}
          </button>
        </h2>

      </div>
    )
  }

}
