import React, { Component } from 'react'
import GanttJS from './GanttJS/index'
import { bind, clear } from 'size-sensor'
import { noop } from './helper'

export default class ReactGantt extends Component {
  ganttRef = undefined

  async componentDidMount() {
    await this.renderFrappeGanttDOM()
    if(this.props.onLoad){
      this.props.onLoad () || noop
    }
  }

  // redraw the gantt when update. now change the viewMode
  componentDidUpdate(prevProps, prevState) {
    if (this.ganttInst) {
      this.ganttInst.refresh(this.props.tasks)
      // 不相等才刷新
      if (this.props.viewMode !== prevProps.viewMode) {
        this.ganttInst.change_view_mode(this.props.viewMode)
      }
    }
  }

  componentWillUnmount() {
    clear(this.ganttRef)
  }

  /**
   * render the gantt chart
   * @returns {GanttJS}
   */
  renderFrappeGanttDOM() {
    // init the Gantt
    // if exist, return
    if (this.ganttInst) return this.ganttInst

    const {
      onClick,
      onDateChange,
      onProgressChange,
      onViewChange,
      customPopupHtml,
      onDragRelationShip,
      tasks,
      viewMode
    } = this.props

    // when resize
    bind(this.ganttRef, () => {
      if (this.ganttInst) {
        this.ganttInst.refresh(this.props.tasks)
      }
    })

    // new instance
    this.ganttInst = new GanttJS(this.ganttRef, tasks, {
      on_click: onClick || noop,
      on_date_change: onDateChange || noop,
      on_progress_change: onProgressChange || noop,
      on_view_change: onViewChange || noop,
      custom_popup_html: customPopupHtml || null,
      on_drag_relationship: onDragRelationShip || noop
    })
    // change view mode
    this.ganttInst.change_view_mode(viewMode)
    return this.ganttInst
  }

  render() {
    return (
      <svg
        ref={node => {
          this.ganttRef = node
        }}
      />
    )
  }
}
