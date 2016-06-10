import classnames from 'classnames'
import React from 'react'

import c from './vocab_editor.css'

export default class VocabEditor extends React.Component {

  render() {
    return (
      <div className={classnames(c.vocabEditor)}>
        <p>The community has finished the furigana blockers for this page, so you can show / hide furigana.</p>
        <p className={classnames(c.highlight)}>Unfortunately, the app doesn't yet support vocabulary from users, since it's still in development. Watch this space, and <a href='https://reddit.com/r/learnjapanese' target='_blank'>/r/LearnJapanese</a>, for updates!</p>
      </div>
    )
  }

}
