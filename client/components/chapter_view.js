import classnames from 'classnames'
import jquery from 'jquery'
import React from 'react'

import PageThumbnail from './page_thumbnail'
import c from './chapter_view.css'

export default class ChapterView extends React.Component {

  render() {
    const chapter = this.props.chapter
    return (
      <div className={classnames(c.chapter)}>
        <h2 className={classnames(c.header, c.chapterTitle)}>
          Chapter {chapter.number}: {chapter.title.en}
          <span className={classnames(c.subJp)}>
            {chapter.title.jp.common}{chapter.title.jp.kana == chapter.title.jp.common ? '' : `（${chapter.title.jp.kana}）`}
          </span>
        </h2>

        <div className={classnames(c.pageList)}>
          {chapter.pages.map(page => (
            <PageThumbnail
              series={this.props.series}
              page={page}
              key={`pageThumbnail-${this.props.series}-${page.chapter}-${page.page}`} />
          ))}
        </div>
      </div>
    )
  }

}
