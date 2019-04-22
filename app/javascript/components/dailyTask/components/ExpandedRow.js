import React from 'react'
import MaterialUsedRow from './MaterialUsedRow'
import NoteList from './NoteList'
import IssueList from './IssueList'
import DailyTaskStore from '../stores/DailyTasksStore'
import SidebarStore from '../stores/SidebarStore'
import MaterialUsedStore from '../stores/MaterialUsedStore'
import NutrientEntryForm from '../../utils/NutrientEntryForm'
import classNames from 'classnames'

const rightBorder = { borderRight: '1px solid #ccc' }

class ExpandedRow extends React.Component {
  onShowAddNotes = event => {
    SidebarStore.openNotes(this.props.batch_id, this.props.id)
    event.preventDefault()
  }

  onShowMaterialUsedSidebar = event => {
    const omitProductIds = this.props.items.map(x => x.product_id)
    SidebarStore.openMaterialUsed(
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
    SidebarStore.openNotes(this.props.batch_id, this.props.id, noteId, body)
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
    SidebarStore.openIssues(
      issueId,
      mode,
      dailyTask,
      this.props.id,
      this.props.batch_id
    )
    event.preventDefault()
  }

  onOpenSidebar = sidebar => e => {
    console.log(sidebar)
    const showButtonStatus = ['started', 'stuck']
    if (showButtonStatus.includes(this.props.work_status)) {
      SidebarStore.openSidebar(
        sidebar,
        this.props.batch_id,
        this.props.id,
        this.props.phase
      )
    }
  }

  onNewIssue = event => {
    const id = null
    const mode = 'create'
    const dailyTask = true
    SidebarStore.openIssues(
      id,
      mode,
      dailyTask,
      this.props.id,
      this.props.batch_id
    )
    event.preventDefault()
  }

  showDoneButton = e => {
    const showButtonStatus = ['started', 'stuck']
    let indelible = ['clip_pot_tag', 'moving_to_tray', 'add_nutrient']
    if (this.props.indelible && indelible.includes(this.props.indelible)) {
      return (
        showButtonStatus.includes(this.props.work_status) &&
        this.props.indelible_done
      )
    } else {
      return showButtonStatus.includes(this.props.work_status)
    }
  }

  render() {
    const { id: taskId, indelible, notes, batch_id, items, issues } = this.props
    const showButtonStatus = ['started', 'stuck']
    const hideButtonStatus = ['done', 'new', 'stopped']
    const showDoneButton = this.showDoneButton()
    return (
      <React.Fragment>
        <div className="flex w100 justify-end tr pv3 ph3">
          <div>
            {indelible === 'add_nutrient' && (
              <a
                href="#0"
                className={classNames(
                  'btn mr3',
                  {
                    'btn--secondary': showButtonStatus.includes(
                      this.props.work_status
                    )
                  },
                  {
                    'btn--disabled': hideButtonStatus.includes(
                      this.props.work_status
                    )
                  }
                )}
                onClick={this.onOpenSidebar(indelible)}
              >
                Add Nutrient
              </a>
            )}
            {indelible === 'clip_pot_tag' && (
              <a
                href="#0"
                className={classNames(
                  'btn mr3',
                  {
                    'btn--secondary': showButtonStatus.includes(
                      this.props.work_status
                    )
                  },
                  {
                    'btn--disabled': hideButtonStatus.includes(
                      this.props.work_status
                    )
                  }
                )}
                onClick={this.onOpenSidebar(indelible)}
              >
                Create UID
              </a>
            )}
            {indelible === 'moving_to_tray' && (
              <a
                href="#0"
                className={classNames(
                  'btn mr3',
                  {
                    'btn--secondary': showButtonStatus.includes(
                      this.props.work_status
                    )
                  },
                  {
                    'btn--disabled': hideButtonStatus.includes(
                      this.props.work_status
                    )
                  }
                )}
                onClick={this.onOpenSidebar(indelible)}
              >
                Moving to Trays
              </a>
            )}
            {indelible === 'moving_to_next_phase' && (
              <a
                href="#0"
                className={classNames(
                  'btn mr3',
                  {
                    'btn--secondary': showButtonStatus.includes(
                      this.props.work_status
                    )
                  },
                  {
                    'btn--disabled': hideButtonStatus.includes(
                      this.props.work_status
                    )
                  }
                )}
                onClick={this.onOpenSidebar(indelible)}
              >
                Move Plants to Next Phase
              </a>
            )}

            {indelible == 'measure_harvest_weight' && (
              <a
                href="#0"
                className={classNames(
                  'btn mr3',
                  {
                    'btn--secondary': showButtonStatus.includes(
                      this.props.work_status
                    )
                  },
                  {
                    'btn--disabled': hideButtonStatus.includes(
                      this.props.work_status
                    )
                  }
                )}
                onClick={this.onOpenSidebar('measure_harvest_weight')}
              >
                Measure weight
              </a>
            )}

            {indelible == 'measure_waste_weight' && (
              <a
                href="#0"
                className={classNames(
                  'btn mr3',
                  {
                    'btn--secondary': showButtonStatus.includes(
                      this.props.work_status
                    )
                  },
                  {
                    'btn--disabled': hideButtonStatus.includes(
                      this.props.work_status
                    )
                  }
                )}
                onClick={this.onOpenSidebar('measure_waste_weight')}
              >
                Measure waste weight
              </a>
            )}

            {showDoneButton ? (
              <a
                href="#0"
                className="btn mr3 btn--primary"
                onClick={e => this.props.onClickStatus('done')}
              >
                Done
              </a>
            ) : (
              <a href="#0" className="btn mr3 btn--disabled">
                Done
              </a>
            )}

            <a
              href="#0"
              className={classNames(
                'btn',
                {
                  'btn--primary': showButtonStatus.includes(
                    this.props.work_status
                  )
                },
                {
                  'btn--disabled': hideButtonStatus.includes(
                    this.props.work_status
                  )
                }
              )}
              onClick={e =>
                showButtonStatus.includes(this.props.work_status)
                  ? this.props.onClickStatus('stuck')
                  : e
              }
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
              const actual = MaterialUsedStore.get(`${x.id}.material_used`)
              const waste = MaterialUsedStore.get(`${x.id}.material_waste`)
              const showTarget = MaterialUsedStore.shouldShowTarget(
                x.catalogue_id
              )

              return (
                <MaterialUsedRow
                  key={x.id}
                  taskId={taskId}
                  batchId={batch_id}
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
