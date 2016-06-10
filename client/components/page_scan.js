import classnames from 'classnames'
import React from 'react'

import FuriganaBlocker from './furigana_blocker'
import NewFuriganaBlocker from './new_furigana_blocker'
import VocabSegmentSelector from './vocab_segment_selector'
import c from './page_scan.css'

export default class PageScan extends React.Component {

  render() {
    const meta = this.props.meta
    const page = this.props.page
    const imgUrl = `/data/images/${meta.series}/${page.chapter}_${page.page}.jpg`

    const newFuriL = this.props.reader.state.newFuriganaLeft
    const newFuriT = this.props.reader.state.newFuriganaTop
    const newFuriW = this.props.reader.state.newFuriganaWidth
    const newFuriH = this.props.reader.state.newFuriganaHeight
    const renderNewFurigana = !(
      newFuriL == 0 && newFuriT == 0 && newFuriW == 0 && newFuriH == 0
    )
    return (
      <div className={classnames(c.pageScan)}>
        <div className={classnames(c.sizeWrapper)}>
          <img className={classnames(c.image)} src={imgUrl} />
          {!!page.furigana ? page.furigana.map((furigana, i) => (
            <FuriganaBlocker key={`furigana-blocker-${i}`} furigana={furigana} highlighted={i == this.props.reader.state.highlightedFurigana} {...this.props} />
          )) : null}
          {renderNewFurigana ? <NewFuriganaBlocker {...this.props} left={newFuriL} top={newFuriT} width={newFuriW} height={newFuriH} /> : null}
          {!!page.vocabSegments ? page.vocabSegments.map((vocabSegment, i) => (
            <VocabSegmentSelector
              key={`vocabSegment-selector-${i}`}
              vocabIndex={i}
              vocabSegment={vocabSegment}
              {...this.props} />
          )) : null}
        </div>
      </div>
    )
  }

}
