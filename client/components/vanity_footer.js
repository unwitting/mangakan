import classnames from 'classnames'
import React from 'react'

import TellPeopleButton from './tell_people_button'
import c from './vanity_footer.css'

export default class VanityFooter extends React.Component {

  render() {
    return (
      <div className={classnames(c.vanityFooter)}>
        {this.props.reader.state.version} made in Japan by <a className={classnames(c.link)} href="//unwttng.com" target="_blank">Jack Preston</a>.
        I'm also <a className={classnames(c.link)} href="http://pressonegames.com/plurum" target="_blank">making a game</a> :)
        <br />
        <TellPeopleButton {...this.props} />
      </div>
    )
  }

}
