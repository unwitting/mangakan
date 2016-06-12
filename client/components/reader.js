import classnames from 'classnames'
import jquery from 'jquery'
import React from 'react'

import c from './reader.css'
import InfoBox from './info_box'
import PageScan from './page_scan'
import TellPeopleOverlay from './tell_people_overlay'

export default class Reader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      furiganaShown: false,
      pageData: null,
      selectedVocabSegment: null,
      seriesMetaData: null,
      showingTellPeopleOverlay: false,
      version: props.route.version,
      newFuriganaLeft: 0,
      newFuriganaTop: 0,
      newFuriganaWidth: 0,
      newFuriganaHeight: 0,
      newFuriganaContent: '',
      newFuriganaGrey: 0,
      furiganaVoted: [],
      furiganaApproved: false,
      highlightedFurigana: null,
    }
  }

  componentDidMount() {
    jquery.get(`/api/${this.props.params.series}/${this.props.params.chapter}/${this.props.params.page}`, res => {
      this.setState({pageData: res.data.page})
    })
    jquery.get(`/api/${this.props.params.series}`, res => {
      this.setState({seriesMetaData: res.data.meta})
    })
  }

  deselectVocabSegments() {
    for (const vocabSegment of this.state.pageData.vocabSegments) {
      delete vocabSegment.selected
    }
    this.setState({selectedVocabSegment: null})
  }

  hideTellPeopleOverlay() {
    this.setState({showingTellPeopleOverlay: false})
  }

  selectVocabSegment(i) {
    this.deselectVocabSegments()
    this.state.pageData.vocabSegments[i].selected = true
    this.setState({selectedVocabSegment: this.state.pageData.vocabSegments[i]})
  }

  showTellPeopleOverlay() {
    this.setState({showingTellPeopleOverlay: true})
  }

  render() {
    const commonChildProps = {
      reader: this,
      page: this.state.pageData,
      meta: this.state.seriesMetaData,
    }
    return (
      <div className={classnames(c.reader)}>
      {!!this.state.pageData && !!this.state.seriesMetaData ?
        <PageScan {...this.props} {...commonChildProps} />
      : null}
      {!!this.state.pageData && !!this.state.seriesMetaData ?
        <InfoBox {...this.props} {...commonChildProps} />
      : null}
      {this.state.showingTellPeopleOverlay ?
        <TellPeopleOverlay {...this.props} {...commonChildProps} />
      : null}
      </div>
    )
  }

}
