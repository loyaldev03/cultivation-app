import React from 'react'
import MaterialUsedRow from './MaterialUsedRow'
import NoteList from './NoteList'
import IssueList from './IssueList'
import DailyTaskStore from '../stores/DailyTasksStore'
import sidebarStore from '../stores/SidebarStore'
import materialUsedStore from '../stores/MaterialUsedStore'
import NutrientEntryForm from '../../utils/NutrientEntryForm'

const rightBorder = { borderRight: '1px solid #ccc' }

class ExpandedRow extends React.Component {
  onShowAddNotes = event => {
    sidebarStore.openNotes(this.props.batch_id, this.props.id)
    event.preventDefault()
  }

  onShowMaterialUsedSidebar = event => {
    const omitProductIds = this.props.items.map(x => x.product_id)
    sidebarStore.openMaterialUsed(
      this.props.batch_id,
      this.props.id,
      omitProductIds
    )

    event.preventDefault()
  }

  onDeleteNote = noteId => {
    const result = confirm('Confirm delete this note?')
    if (result) {
      DailyTaskStore.deleteNote(this.props.id, noteId)
    }
  }

  onEditNote = (noteId, body) => {
    sidebarStore.openNotes(this.props.batch_id, this.props.id, noteId, body)
  }

  onUpdateNutrients = nutrients => {
    DailyTaskStore.updateNutrients(
      this.props.batch_id,
      this.props.id,
      nutrients
    )
  }

  onShowIssue = issue => {
    let issueId = issue.id
    let mode = 'details'
    let dailyTask = true // What
    sidebarStore.openIssues(
      issueId,
      mode,
      dailyTask,
      this.props.id,
      this.props.batch_id
    )
    event.preventDefault()
  }

  onClickAddNutrient = event => {
    sidebarStore.openSidebar('add_nutrient', this.props.batch_id, this.props.id)
  }

  onClickCreateUid = event => {
    sidebarStore.openSidebar('clip_pot_tag', this.props.batch_id, this.props.id)
  }

  onNewIssue = event => {
    const id = null
    const mode = 'create'
    const dailyTask = true
    sidebarStore.openIssues(
      id,
      mode,
      dailyTask,
      this.props.id,
      this.props.batch_id
    )
    event.preventDefault()
  }

  render() {
    const {
      id: taskId,
      indelible,
      notes,
      batch_id: batchId,
      items,
      issues
    } = this.props

    return (
      <React.Fragment>
        <div className="flex w100 justify-end tr pv3 ph3">
          <div>
            {indelible === 'add_nutrient' && (
              <a
                href="#0"
                className="btn btn--secondary mr3"
                onClick={this.onClickAddNutrient}
              >
                Add Nutrient
              </a>
            )}
            {indelible === 'clip_pot_tag' && (
              <a
                href="#0"
                className="btn btn--secondary mr3"
                onClick={this.onClickCreateUid}
              >
                Create UID
              </a>
            )}
            <a
              href="#0"
              className="btn btn--primary mr2"
              onClick={e => this.props.onClickStatus('done')}
            >
              Done
            </a>
            <a
              href="#0"
              className="btn btn--secondary"
              onClick={e => this.props.onClickStatus('stuck')}
            >
              I'm stuck
            </a>
          </div>
        </div>
        <div className="flex ba b--black-20 ma2 br2 mb3">
          <div className="w-60 ph2 pt2 pb3" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Materials</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={this.onShowMaterialUsedSidebar}
              >
                Add
              </a>
            </div>

            <div className="flex items-center pb1 justify-between">
              <div className="f6 dark-gray w-60">&nbsp;</div>
              <div
                className="f6 grey flex items-center justify-center"
                style={{ width: '100px', minWidth: '100px' }}
              >
                Target
              </div>
              <div
                className="f6 grey flex items-center justify-center mr2"
                style={{ minWidth: '100px' }}
              >
                Actual
              </div>
              <div
                className="f6 grey flex items-center justify-center"
                style={{ minWidth: '100px' }}
              >
                Waste
              </div>
              <div
                style={{ width: '50px', minWidth: '50px' }}
                className="flex items-center justify-end"
              >
                &nbsp;
              </div>
            </div>
            {items.map(x => {
              const actual = materialUsedStore.get(`${x.id}.material_used`)
              const waste = materialUsedStore.get(`${x.id}.material_waste`)
              const showTarget = materialUsedStore.shouldShowTarget(
                x.catalogue_id
              )

              return (
                <MaterialUsedRow
                  key={x.id}
                  taskId={taskId}
                  batchId={batchId}
                  id={x.id}
                  material={x.product_name}
                  expected={x.quantity}
                  actual={actual.quantity}
                  waste={waste.quantity}
                  uom={x.uom}
                  showTarget={showTarget}
                />
              )
            })}
          </div>

          <div className="w-30 ph2 pt2" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Issues</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={this.onNewIssue}
              >
                Add
              </a>
            </div>
            <IssueList
              show={true}
              issues={issues}
              onShow={this.onShowIssue}
              onDelete={this.onToggleAddIssue}
            />
          </div>

          <div className="w-30 ph2 pt2">
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Notes</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={this.onShowAddNotes}
              >
                Add
              </a>
            </div>
            <NoteList
              show={true}
              notes={notes}
              onEdit={this.onEditNote}
              onDelete={this.onDeleteNote}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ExpandedRow
