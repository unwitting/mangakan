import classnames from 'classnames'
import jquery from 'jquery'
import React from 'react'

import c from './page_thumbnail.css'

export default class PageThumbnail extends React.Component {

  render() {
    const page = this.props.page
    const opacity =
      page.status == 'COMPLETE' ? 1 :
      page.status == 'NEW' ? 0.4 :
      0.7
    return (
      <div className={classnames(c.pageThumbnail)}>
        <a
          className={classnames(c.image)}
          key={`pageThumbnail-${this.props.series}-${page.chapter}-${page.page}`}
          href={`/${this.props.series}/${page.chapter}/${page.page}`}
          style={{
            backgroundImage: `url(/data/images/${this.props.series}/${page.chapter}_${page.page}.jpg)`,
            opacity,
          }}>
        </a>
        <label className={classnames(c.label)}>p{page.page}: {page.status}</label>
      </div>
    )
  }

}
