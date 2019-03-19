import React from 'react'
import classNames from 'classnames'
import InlineEditTextField from './InlineEditTextField'
import Tippy from '@tippy.js/react'

// TODO: Should not be here....
import dailyTaskSidebarStore from '../../../dailyTask/stores/SidebarStore'
export default class InlineEditTaskNameField extends InlineEditTextField {
  openSidebar = issue => {
    this.setState({ taskSelected: id })
    let id = issue.id
    let mode = 'details'
    dailyTaskSidebarStore.openIssues(id, mode)
    event.preventDefault()
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
              <Tippy
                placement="top"
                interactive={true}
                content={
                  <div className="bg-white f6 flex">
                    <div className="db shadow-4 grey pa2">
                      <span>
                        Issues
                        <span className="b--orange ba orange f7 fw4 ph1 br2 ml1">
                          {issues.length}
                        </span>
                      </span>
                      <ul className="pa2 list mt2 flex-auto br2 overflow-auto tl">
                        {issues.map((i, key) => (
                          <li
                            key={key}
                            className="pointer br2 dim--grey pa1"
                            onClick={e => this.openSidebar(i)}
                          >
                            {i.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }
              >
                <i className="material-icons icon--small red pointer">error</i>
              </Tippy>
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
