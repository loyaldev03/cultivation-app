import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'

@observer
class AddEditProductCategoryForm extends React.Component {
  state = {
    mode: 'add'
  }
  setData(data) {
    this.setState({
      mode: data.mode
    })
  }

  onSubmit = e => {
    console.log('onSubmit')
  }

  render() {
    const { onClose, onSave } = this.props
    const { mode } = this.state
    return (
      <div className="h-100 flex flex-auto flex-column">
        <SlidePanelHeader
          onClose={onClose}
          title={
            mode == 'add' ? 'Add Product Category' : 'Edit Product Category'
          }
        />
        <form
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4">
            <div className="mt2 fl w-100">
              <div className="w-100 fl pr3">
                <label className="f6 fw6 db mb1 gray ttc">Name</label>
                <input
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  required={true}
                />
              </div>
            </div>
            <div className="mt3 fl w-100">
              <div className="w-100 fl">
                <label className="f6 fw6 db gray ttc">METRC Item Category</label>
                <span className="f6 grey pv2 dib">Map this category to corresponding Item Category on METRC</span>
                <select className="w-100" />
              </div>
            </div>
          </div>
          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
            <input
              type="submit"
              value="Save"
              className="fr btn btn--primary"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default AddEditProductCategoryForm
