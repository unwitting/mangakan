import classnames from 'classnames'
import React from 'react'

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
      </div>
    )
  }

}
