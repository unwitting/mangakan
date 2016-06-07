import classnames from 'classnames'
import React from 'react'

import c from './vanity_footer.css'

export default class VanityFooter extends React.Component {

  render() {
    return (
      <div className={classnames(c.vanityFooter)}>
        Made in Japan by <a className={classnames(c.link)} href="//unwttng.com" target="_blank">Jack Preston</a>.
        I'm also <a className={classnames(c.link)} href="http://pressonegames.com/plurum" target="_blank">making a game</a> :)
      </div>
    )
  }

}
