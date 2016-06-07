import classnames from 'classnames'
import React from 'react'

import FuriganaBlocker from './furigana_blocker'
import VocabSegmentSelector from './vocab_segment_selector'
import c from './page_scan.css'

export default class PageScan extends React.Component {

  render() {
    const imgUrl = `/data/images/${this.props.meta.series}/${this.props.page.image}`
    return (
      <div className={classnames(c.pageScan)}>
        <img className={classnames(c.image)} src={imgUrl} />
        {this.props.page.furigana.map((furigana, i) => (
          <FuriganaBlocker key={`furigana-blocker-${i}`} furigana={furigana} {...this.props} />
        ))}
        {this.props.page.vocabSegments.map((vocabSegment, i) => (
          <VocabSegmentSelector
            key={`vocabSegment-selector-${i}`}
            vocabIndex={i}
            vocabSegment={vocabSegment}
            {...this.props} />
        ))}
      </div>
    )
  }

}
