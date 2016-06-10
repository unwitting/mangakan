import classnames from 'classnames'
import jquery from 'jquery'
import React from 'react'

import ChapterView from './chapter_view'
import c from './series_browser.css'

export default class SeriesBrowser extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      seriesMetaData: null,
      version: props.route.version,
    }
  }

  componentDidMount() {
    jquery.get(`/api/${this.props.params.series}`, res => {
      this.setState({seriesMetaData: res.data.meta})
    })
  }

  getChapters() {
    const meta = this.state.seriesMetaData
    const chapters = []
    for (let chapterI in meta.chapters) {
      meta.chapters[chapterI].number = chapterI
      chapters.push(meta.chapters[chapterI])
    }
    return chapters
  }

  render() {
    const meta = this.state.seriesMetaData
    const commonChildProps = {
      browser: this,
      meta,
    }
    return !!this.state.seriesMetaData ? (
      <div className={classnames(c.browser)}>

        <h1 className={classnames(c.header, c.seriesTitle)}>
          {meta.title.en}
          <span className={classnames(c.subJp)}>
            {meta.title.jp.common}{meta.title.jp.kana == meta.title.jp.common ? '' : `（${meta.title.jp.kana}）`}
          </span>
        </h1>

        {this.getChapters().map((chapter, i) => (
          <ChapterView series={this.state.seriesMetaData.series} chapter={chapter} key={`chapter-${i}`} />
        ))}

      </div>
    ) : (
      <div className={classnames(c.browser)} />
    )
  }

}
