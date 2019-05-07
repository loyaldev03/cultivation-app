import 'babel-polyfill'
import React, { lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { SlidePanel } from '../utils'
import WorkerScheduleStore from './stores/WorkerScheduleStore'
const PtoForm = lazy(() => import('./PtoForm'))
const OtForm = lazy(() => import('./OtForm'))

@observer
class RequestWorkApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPtoPanel: false,
      showOtPanel: false,
      isExempt: props.isExempt
    }
  }

  onClickPto = () => {
    this.setState({ showPtoPanel: !this.state.showPtoPanel })
  }

  onClickOt = () => {
    this.setState({ showOtPanel: !this.state.showOtPanel })
  }

  render() {
    const { showPtoPanel, showOtPanel, isExempt } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <SlidePanel
          width="500px"
          show={showPtoPanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <PtoForm
                ref={form => (this.assignResouceForm = form)}
                title={'Request PTO'}
                onClose={() => this.setState({ showPtoPanel: false })}
                onSave={(start_date, end_date, description) => {
                  WorkerScheduleStore.savePto(start_date, end_date, description)
                  this.setState({ showPtoPanel: false })
                }}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={showOtPanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <OtForm
                ref={form => (this.assignResouceForm = form)}
                title={'Request OT'}
                onClose={() => this.setState({ showOtPanel: false })}
                onSave={(start_date, end_date, description) => {
                  console.log(start_date)
                  console.log(end_date)
                  WorkerScheduleStore.saveOt(start_date, end_date, description)
                  this.setState({ showOtPanel: false })
                }}
              />
            </Suspense>
          )}
        />
        <div className="mt4">
          {
            isExempt ? (
              <a className="btn mr3 btn--primary" onClick={this.onClickPto}>
                Request PTO
              </a>
            ) : (
              <div>
                <a className="btn mr3 btn--primary" onClick={this.onClickOt}>
                  Request OT
                </a>
                <a className="btn mr3 btn--primary">Change Schedule</a>
              </div>
            )
          }
        </div>
      </React.Fragment>
    )
  }
}

export default RequestWorkApp
