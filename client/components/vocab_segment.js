import classnames from 'classnames'
import React from 'react'

import c from './vocab_segment.css'

export default class VocabSegment extends React.Component {

  render() {
    const vocabSegment = this.props.reader.state.selectedVocabSegment
    const meta = this.props.meta
    const page = this.props.page
    return (
      <div className={classnames(c.vocabSegment)}>
        <h2 className={classnames(c.jpCommon)}>{vocabSegment.content.jp.common}</h2>
        <p className={classnames(c.jpKana)}>{vocabSegment.content.jp.kana}</p>
        <p className={classnames(c.translation)}>{vocabSegment.translation}</p>
        <ul className={classnames(c.vocabList)}>{vocabSegment.vocab.map(vocabI => {
          const vocab = page.vocab[vocabI]
          if (vocab.type == 'kanji') {
            return (
              <li className={classnames(c.vocabElement)} key={`${vocab.type}-${vocabI}`}>
                <span className={classnames(c.vocabElementKanji)}>{vocab.kanji}</span>
                <span className={classnames(c.vocabElementReading)}>{vocab.kunyomi.concat(vocab.onyomi).join('・')}</span>
                <span className={classnames(c.vocabElementMeaning)}>{vocab.meanings.join(' / ')}</span>
              </li>
            )
          } else if (vocab.type == 'word') {
            return (
              <li className={classnames(c.vocabElement)} key={`${vocab.type}-${vocabI}`}>
                <span className={classnames(c.vocabElementJpCommon)}>{vocab.jp.common}</span>
                <span className={classnames(c.vocabElementJpKana)}>{vocab.jp.kana}</span>
                <span className={classnames(c.vocabElementMeaning)}>{vocab.meanings.join(' / ')}</span>
              </li>
            )
          }
        })}</ul>
        <h3 className={classnames(c.notesTitle)}>Notes</h3>
        <ul className={classnames(c.notes)}>{vocabSegment.notes.map((note, i) => {
          return (
            <li className={classnames(c.note)} key={`note-${i}`}>{note}</li>
          )
        })}</ul>
      </div>
    )
  }

}
