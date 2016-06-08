import classnames from 'classnames'
import React from 'react'

import DataViewer from './data_viewer'
import FuriganaToggler from './furigana_toggler'
import InfoHeader from './info_header'
import VanityFooter from './vanity_footer'
import VocabSegment from './vocab_segment'
import c from './info_box.css'

export default class InfoBox extends React.Component {

  render() {
    return (
      <div className={classnames(c.infoBox)}>

        <InfoHeader {...this.props} />
        {/*this.props.app.state.editMode ? <DataViewer {...this.props} /> : null*/}
        <FuriganaToggler {...this.props} />
        {!!this.props.reader.state.selectedVocabSegment ? <VocabSegment {...this.props} /> : null}
        <VanityFooter {...this.props} />

      </div>
    )
  }

}
