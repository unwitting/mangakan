import classnames from 'classnames'
import React from 'react'

import c from './info_header.css'

export default class InfoHeader extends React.Component {

  render() {
    const meta = this.props.meta
    const page = this.props.page

    let hasPreviousPage = false
    let hasNextPage = false
    for (let otherPage of meta.chapters[page.chapter].pages) {
      if (otherPage.page == page.page - 1) {hasPreviousPage = true}
      else if (otherPage.page == page.page + 1) {hasNextPage = true}
      if (hasPreviousPage && hasNextPage) {break}
    }

    return (
      <div className={classnames(c.infoHeader)} style={{opacity: page.status == 'COMPLETE' ? 1 : 0.35}}>

        <a href={`/${meta.series}`} className={classnames(c.link)}>
          <h1 className={classnames(c.header, c.seriesTitle)}>
            {meta.title.en}
            <span className={classnames(c.subJp)}>{meta.title.jp.common}</span>
          </h1>
        </a>

        <h2 className={classnames(c.header, c.chapterTitle)}>
          Chapter {page.chapter}: {meta.chapters[page.chapter].title.en}
          <span className={classnames(c.subJp)}>{meta.chapters[page.chapter].title.jp.common}</span>
        </h2>

        <h2 className={classnames(c.header, c.pageTitle)}>
          {hasPreviousPage ? <a
            href={`/${meta.series}/${page.chapter}/${page.page - 1}`}
            className={classnames(c.paginationButton, c.previousButton)}>
            previous
          </a> : null}
          Page {page.page}
          {hasNextPage ? <a
            href={`/${meta.series}/${page.chapter}/${page.page + 1}`}
            className={classnames(c.paginationButton, c.nextButton)}>
            next
          </a> : null}
        </h2>

      </div>
    )
  }

}
