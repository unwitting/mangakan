import classnames from 'classnames'
import React from 'react'

import c from './vocab_segment_selector.css'

export default class VocabSegmentSelector extends React.Component {

  handleClick() {
    if (this.props.vocabSegment.selected) {this.props.reader.deselectVocabSegments()}
    else {this.props.reader.selectVocabSegment(this.props.vocabIndex)}
  }

  render() {
    return (
      <div
        className={classnames(
          c.vocabSegmentSelector,
          {[c.selected]: this.props.vocabSegment.selected}
        )}
        style={{
          borderColor: this.props.vocabSegment.color,
          width: `${this.props.vocabSegment.w}%`,
          height: `${this.props.vocabSegment.h}%`,
          left: `${this.props.vocabSegment.x}%`,
          top: `${this.props.vocabSegment.y}%`,
        }}
        onClick={this.handleClick.bind(this)}>
      </div>
    )
  }

}
