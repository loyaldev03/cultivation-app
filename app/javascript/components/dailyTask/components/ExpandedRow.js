import React from 'react'
import { toJS } from 'mobx'
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

  onDeleteNote = noteId => {
    const result = confirm('Confirm delete this note?')
    if (result) {
      DailyTaskStore.deleteNote(this.props.taskId, noteId)
    }
  }

  onEditNote = (noteId, body) => {
    sidebarStore.openNotes(this.props.batch_id, this.props.id, noteId, body)
  }

  onUpdateNutrients = nutrients => {
    DailyTaskStore.updateNutrients(
      this.props.batchId,
      this.props.taskId,
      nutrients
    )
  }

  onClickNow = issue => {
    console.log(issue)
    let id = issue.id
    let mode = 'details'
    window.editorSidebar.open({ id, mode, width: '500px' })
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

    // console.group('expanded row')
    // console.log(toJS(this.props))
    // // console.log(toJS(this.props.items))
    // console.log(batchId, taskId, indelible)
    // console.groupEnd()

    return (
      <React.Fragment>
        <div className="flex justify-between pv3 ph3">
          <div>
            {indelible === 'add_nutrient' && (
              <React.Fragment>
                <span className="f6 grey db">Add Nutrients:</span>
                <NutrientEntryForm
                  className="nutrient-form mt2 w-70"
                  fields={DailyTaskStore.getNutrientsByTask(batchId, taskId)}
                  fieldType="checkboxes"
                  onUpdateNutrients={this.onUpdateNutrients}
                />
              </React.Fragment>
            )}
          </div>
          <div>
            <a
              href="#"
              className="btn btn--primary mr2"
              onClick={e => this.props.onClickStatus('done')}
            >
              Done
            </a>
            <a
              href="#"
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
                onClick={() => {
                  console.log('open material sidebar')
                  sidebarStore.openMaterialUsed(batchId, taskId)
                }}
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

          <div className="w-30 ph2 pt2 pb3" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Issues</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={event =>
                  window.editorSidebar.open(event, null, 'create')
                }
              >
                Add
              </a>
            </div>
            <IssueList
              show={true}
              issues={issues}
              onEdit={this.onClickNow}
              onDelete={this.onToggleAddIssue}
            />
          </div>

          <div className="w-30 ph2 pt2 pb3">
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
