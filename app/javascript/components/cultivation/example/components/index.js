
import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";


// import BatchModel from "./models/BatchModel";

import { observable } from "mobx";
import { observer } from "mobx-react";


@observer
class Index extends React.Component {

  addSomething = () => {
    // BatchModel.update("complete")
  }

  render() {
    return (
      <React.Fragment>
        <a className="btn btn-primary" onClick={this.addSomething} type="button" >Complete</a>
      </React.Fragment>
    )
  }

}

export default Index
