import classnames from 'classnames'
import React from 'react'

import FuriganaEditor from './furigana_editor'
import FuriganaToggler from './furigana_toggler'
import InfoHeader from './info_header'
import VanityFooter from './vanity_footer'
import VocabEditor from './vocab_editor'
import VocabSegment from './vocab_segment'
import c from './info_box.css'

export default class InfoBox extends React.Component {

  render() {
    return (
      <div className={classnames(c.infoBox)}>

        <InfoHeader {...this.props} />
        {this.props.page.furiganaVotes >= 0 && !this.props.page.vocab ? <VocabEditor {...this.props} /> : null}
        {this.props.page.furiganaVotes >= 0 ? <FuriganaToggler {...this.props} /> : <FuriganaEditor {...this.props} />}
        {!!this.props.reader.state.selectedVocabSegment ? <VocabSegment {...this.props} /> : null}
        <VanityFooter {...this.props} />

      </div>
    )
  }

}
