import classnames from 'classnames'
import cookies from 'js-cookie'
import jquery from 'jquery'
import React from 'react'

import c from './furigana_editor.css'

export default class FuriganaEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      furiganaVoted: []
    }
  }

  handleFuriganaLeftChange(e) {
    const r = this.props.reader
    const newLeft = parseFloat(e.target.value)
    const currentWidth = parseFloat(r.state.newFuriganaWidth)
    r.setState({
      newFuriganaLeft: newLeft,
      newFuriganaWidth: (currentWidth + newLeft > 100) ? 100 - newLeft : currentWidth,
    })
  }
  handleFuriganaTopChange(e) {
    const r = this.props.reader
    const newTop = parseFloat(e.target.value)
    const currentHeight = parseFloat(r.state.newFuriganaHeight)
    r.setState({
      newFuriganaTop: newTop,
      newFuriganaHeight: (currentHeight + newTop > 100) ? 100 - newTop : currentHeight,
    })
  }
  handleFuriganaWidthChange(e) {
    const r = this.props.reader
    const newWidth = parseFloat(e.target.value)
    const currentLeft = parseFloat(r.state.newFuriganaLeft)
    r.setState({
      newFuriganaWidth: newWidth,
      newFuriganaLeft: (newWidth + currentLeft > 100) ? 100 - newWidth : currentLeft,
    })
  }
  handleFuriganaHeightChange(e) {
    const r = this.props.reader
    const newHeight = parseFloat(e.target.value)
    const currentTop = parseFloat(r.state.newFuriganaTop)
    r.setState({
      newFuriganaHeight: newHeight,
      newFuriganaTop: (newHeight + currentTop > 100) ? 100 - newHeight : currentTop,
    })
  }

  handleFuriganaContentChange(e) {
    this.props.reader.setState({newFuriganaContent: e.target.value})
  }

  handleFuriganaElementEnter(furiganaI) {
    this.props.reader.setState({highlightedFurigana: furiganaI})
  }
  handleFuriganaElementLeave(furiganaI) {
    this.props.reader.setState({highlightedFurigana: null})
  }

  handleFuriganaElementUpvote(furiganaI) {
    this.handleFuriganaElementVote(furiganaI, true)
  }
  handleFuriganaElementDownvote(furiganaI) {
    this.handleFuriganaElementVote(furiganaI, false)
  }
  handleFuriganaElementVote(furiganaI, upVote) {
    const numFuriganaBeforeVote = this.props.page.furigana.length
    jquery.ajax({
      url: `/api/vote_on_furigana/${this.props.meta.series}/${this.props.page.chapter}/${this.props.page.page}`,
      type: 'POST',
      data: JSON.stringify({
        i: furiganaI,
        up: upVote,
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: res => {
        const removed = res.data.page.furigana.length < numFuriganaBeforeVote
        const furiganaVoted = this.props.reader.state.furiganaVoted
        if (removed) {
          // Decrease the index of all above it
          for (let i = 0; i < furiganaVoted.length; i++) {
            if (furiganaVoted[i] > furiganaI) {furiganaVoted[i]--}
          }
        } else {
          // Register the vote
          furiganaVoted.push(furiganaI)
        }
        this.props.reader.setState({pageData: res.data.page, furiganaVoted})
      },
    })
  }

  handleAddFuriganaClick() {
    const readerState = this.props.reader.state
    jquery.ajax({
      url: `/api/add_furigana/${this.props.meta.series}/${this.props.page.chapter}/${this.props.page.page}`,
      type: 'POST',
      data: JSON.stringify({
        left: parseFloat(readerState.newFuriganaLeft),
        top: parseFloat(readerState.newFuriganaTop),
        width: parseFloat(readerState.newFuriganaWidth),
        height: parseFloat(readerState.newFuriganaHeight),
        content: readerState.newFuriganaContent,
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: res => {
        this.props.reader.setState({
          pageData: res.data.page,
          newFuriganaLeft: 0,
          newFuriganaTop: 0,
          newFuriganaWidth: 0,
          newFuriganaHeight: 0,
        })
      },
    })
  }

  handleFuriganaApproveClick() {
    jquery.ajax({
      url: `/api/approve_furigana/${this.props.meta.series}/${this.props.page.chapter}/${this.props.page.page}`,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      success: res => {
        this.props.reader.setState({
          pageData: res.data.page,
          furiganaApproved: true,
        })
      },
    })
  }

  render() {
    const furigana = this.props.page.furigana
    const readerState = this.props.reader.state
    const newFuriganaValid =
      readerState.newFuriganaWidth > 0 &&
      readerState.newFuriganaHeight > 0 &&
      readerState.newFuriganaContent.length > 0
    return (
      <div className={classnames(c.furiganaEditor)}>

        <p className={classnames(c.highlight)}>The <span className={classnames(c.emph)}>furigana blocker boxes</span> for this page haven't been sorted out yet. Help us get them done.</p>

        {furigana.length > 0 ? <ul className={classnames(c.currentFuriganaList)}>
          <p className={classnames(c.currentFuriganaHint)}>
            These are the furigana blockers defined so far.
            &nbsp;Take a look at each, and tell us if it's good or bad.
            &nbsp;<span className={classnames(c.emph)}>Bad</span> means not covering the furigana, covering it too broadly, blocking non-furigana, or <span className={classnames(c.emph)}>content not matching the page</span>.
          </p>
          {furigana.map((f, i) => {
            const voted = readerState.furiganaVoted.indexOf(i) !== -1
            return (
              <li
                className={classnames(c.currentFuriganaElement)}
                key={`furigana-element-${i}`}
                onMouseEnter={this.handleFuriganaElementEnter.bind(this, i)}
                onMouseLeave={this.handleFuriganaElementLeave.bind(this, i)}>
                Content <span className={classnames(c.emph)}>「{f.content}」</span>
                {/*{f.votes}*/}
                <button
                  disabled={voted}
                  className={classnames(c.goodFuriganaButton)}
                  onClick={this.handleFuriganaElementUpvote.bind(this, i)}>
                  Good
                </button>
                <button
                  disabled={voted}
                  className={classnames(c.badFuriganaButton)}
                  onClick={this.handleFuriganaElementDownvote.bind(this, i)}>
                  Bad
                </button>
              </li>
            )
          })}
        </ul> : null}

        <ul className={classnames(c.newFuriganaComponents)}>
          If you see furigana without a blocker, or with a bad blocker, create one here. Drag the sliders to position it, then click the button.
          <li className={classnames(c.furiganaComponent)}>
            Width<br/>
            <input className={classnames(c.slider)} type='range' step={0.1} min={0} max={100 - readerState.newFuriganaLeft} value={readerState.newFuriganaWidth} onChange={this.handleFuriganaWidthChange.bind(this)} />
          </li>
          <li className={classnames(c.furiganaComponent)}>
            Height<br/>
            <input className={classnames(c.slider)} type='range' step={0.1} min={0} max={100 - readerState.newFuriganaTop} value={readerState.newFuriganaHeight} onChange={this.handleFuriganaHeightChange.bind(this)} />
          </li>
          <li className={classnames(c.furiganaComponent)}>
            Left<br/>
            <input className={classnames(c.slider)} type='range' step={0.1} min={0} max={100 - readerState.newFuriganaWidth} value={readerState.newFuriganaLeft} onChange={this.handleFuriganaLeftChange.bind(this)} />
          </li>
          <li className={classnames(c.furiganaComponent)}>
            Top<br/>
            <input className={classnames(c.slider)} type='range' step={0.1} min={0} max={100 - readerState.newFuriganaHeight} value={readerState.newFuriganaTop} onChange={this.handleFuriganaTopChange.bind(this)} />
          </li>
          <div className={classnames(c.addButtonWrapper)}>
            <input
              className={classnames(c.newFuriganaContent)}
              type='text'
              value={readerState.newFuriganaContent}
              placeholder='Furigana content (かな)'
              onChange={this.handleFuriganaContentChange.bind(this)} />
            <button
              className={classnames(c.addButton)}
              disabled={!newFuriganaValid}
              onClick={this.handleAddFuriganaClick.bind(this)}>Add furigana blocker</button>
          </div>
        </ul>

        <p>
        If you've checked all the furigana blockers, and think none are missing or bad, click this button. Once enough people do, they'll be accepted.
        </p>
        <button
          disabled={readerState.furiganaApproved}
          className={classnames(c.approveButton, {[c.highlight]: !readerState.furiganaApproved})}
          onClick={this.handleFuriganaApproveClick.bind(this)}>I approve of the furigana blockers for this page</button>

      </div>
    )
  }

}
