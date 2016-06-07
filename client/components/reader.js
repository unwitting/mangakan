import classnames from 'classnames'
import React from 'react'

import c from './reader.css'
import InfoBox from './info_box'
import PageScan from './page_scan'

export default class Reader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      furiganaShown: false,
      selectedVocabSegment: null,
    }
  }

  deselectVocabSegments() {
    for (const vocabSegment of this.props.page.vocabSegments) {
      delete vocabSegment.selected
    }
    this.setState({selectedVocabSegment: null})
  }

  selectVocabSegment(i) {
    this.deselectVocabSegments()
    this.props.page.vocabSegments[i].selected = true
    this.setState({selectedVocabSegment: this.props.page.vocabSegments[i]})
  }

  render() {
    return (
      <div className={classnames(c.reader)}>
        <PageScan reader={this} {...this.props} />
        <InfoBox reader={this} {...this.props} />
      </div>
    )
  }

}
