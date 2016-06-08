import classnames from 'classnames'
import React from 'react'

import c from './data_viewer.css'

export default class DataViewer extends React.Component {

  render() {

    return (
      <div className={classnames(c.dataViewer)}>
        <ul>
          Furigana boxes
        </ul>
      </div>
    )
  }

}
