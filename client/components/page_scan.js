import classnames from 'classnames'
import React from 'react'

import FuriganaBlocker from './furigana_blocker'
import VocabSegmentSelector from './vocab_segment_selector'
import c from './page_scan.css'

export default class PageScan extends React.Component {

  render() {
    const meta = this.props.meta
    const page = this.props.page
    const imgUrl = `/data/images/${meta.series}/${page.chapter}_${page.page}.jpg`
    return (
      <div className={classnames(c.pageScan)}>
        <div className={classnames(c.sizeWrapper)}>
          <img className={classnames(c.image)} src={imgUrl} />
          {page.furigana.map((furigana, i) => (
            <FuriganaBlocker key={`furigana-blocker-${i}`} furigana={furigana} {...this.props} />
          ))}
          {page.vocabSegments.map((vocabSegment, i) => (
            <VocabSegmentSelector
              key={`vocabSegment-selector-${i}`}
              vocabIndex={i}
              vocabSegment={vocabSegment}
              {...this.props} />
          ))}
        </div>
      </div>
    )
  }

}
