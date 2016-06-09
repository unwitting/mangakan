import classnames from 'classnames'
import React from 'react'

import c from './tell_people_overlay.css'

export default class TellPeopleOverlay extends React.Component {

  getTweetIntentUrl() {
    const url = encodeURIComponent(`${location.protocol}//${location.hostname}${location.pathname}`)
    const tags = encodeURIComponent(['mangakan', 'manga', 'learnjapanese', '日本語'].join(','))
    const related = encodeURIComponent(['unwttng'].join(','))
    const text = encodeURIComponent(`Mangakan - read manga, in Japanese, at your own pace`)
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${tags}&related=${related}`
  }

  handleBackgroundClick() {
    this.props.app.hideTellPeopleOverlay()
  }

  handleContentClick(e) {
    e.stopPropagation()
  }

  render() {

    return (
      <div className={classnames(c.overlay)} onClick={this.handleBackgroundClick.bind(this)}>
        <div className={classnames(c.content)} onClick={this.handleContentClick.bind(this)}>
          <h2 className={classnames(c.header)}>Share the love!</h2>
          <p className={classnames(c.text)}>
            Have friends who learn Japanese? Or love manga? Preferably both? Tell them about Mangakan.<br />
            The more the merrier, so please consider it :)
          </p>
          <a href={this.getTweetIntentUrl()} target='_blank' className={classnames(c.twitterButton)}>Tweet</a>
        </div>
      </div>
    )
  }

}
