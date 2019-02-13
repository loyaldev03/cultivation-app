import React from 'react'
import classNames from 'classnames'
import InlineEditTextField from './InlineEditTextField'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'

export default class InlineEditTaskNameField extends InlineEditTextField {
  onClickNow = issue => {
    let id = issue.id
    let mode = 'details'
    window.editorSidebar.open({ id, mode, width: '500px' })
  }

  render() {
    const {
      indent,
      text,
      hasChild,
      isCollapsed,
      onClick,
      onCollapseClick,
      issues
    } = this.props
    return (
      <div
        className={`pa1 flex flex-auto items-center indent--${indent}`}
        draggable={true}
      >
        {hasChild ? (
          <i
            className="material-icons dim grey f7 pointer"
            onClick={onCollapseClick}
          >
            {isCollapsed ? 'arrow_right' : 'arrow_drop_down'}
          </i>
        ) : (
          <span className="dib indent--1" />
        )}
        {this.state.isEdit ? (
          <React.Fragment>
            <input
              autoFocus
              ref={input => (this.textInput = input)}
              className={classNames('flex-auto b--grey link ph1', {
                orange: hasChild,
                grey: !hasChild
              })}
              onKeyPress={this.handleKeyPress}
              type="text"
              defaultValue={text}
            />
            <i
              className="material-icons green icon--small icon--btn"
              onClick={this.switchViewMode}
            >
              done
            </i>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {issues.length > 0 ? (
              <Tooltip
                interactive
                position="top"
                trigger="click"
                theme="light"
                html={
                  <div>
                    <span>Issues
                      <span
                        className='f7 fw6 ph3 pv1 ba br2 dib tc bg-orange b--orange white ml2'
                      >
                        {issues.length}
                      </span>
                    </span>
                    <ul className="pa2 list mt2 flex-auto ba br2 b--light-grey overflow-auto tl">
                      {issues.map((i, key) => (
                        <li
                          key={key}
                          className="pointer br2 dim--grey pa1"
                          onClick={e => this.onClickNow(i)}
                        >
                          {i.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              >
                <i className="material-icons icon--small red pointer">error</i>
              </Tooltip>
            ) : null}
            <a
              href="#0"
              className={classNames('pa1 link', {
                orange: hasChild,
                grey: !hasChild
              })}
              onClick={onClick}
            >
              {text}
            </a>
            <i
              className="material-icons icon--small icon--btn child"
              onClick={this.switchEditMode}
            >
              edit
            </i>
          </React.Fragment>
        )}
      </div>
    )
  }
}
