import classnames from 'classnames'
import jquery from 'jquery'
import React from 'react'

import c from './chapter_view.css'

export default class ChapterView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {pages: null}
  }

  componentDidMount() {
    jquery.get(`/api/${this.props.series}/${this.props.chapter.number}`, res => {
      console.log(res)
      this.setState({pages: res.data.pages})
    })
  }

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
        {!!this.state.pages ? (<div className={classnames(c.pageList)}>
          {this.state.pages.map(page => (
            <a
              className={classnames(c.pageThumbnail)}
              key={`pageThumbnail-${this.props.series}-${page.chapter}-${page.page}`}
              href={`/${this.props.series}/${page.chapter}/${page.page}`}
              style={{
                backgroundImage: `url(/data/images/${this.props.series}/${page.chapter}_${page.page}.jpg)`,
              }}>
            </a>
          ))}
        </div>) : null}
      </div>
    )
  }

}
