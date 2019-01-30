import React from 'react'
class ErrorList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      errors: this.props.errors
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.errors && this.state.errors !== prevProps.errors){
      this.setState({errors: prevProps.errors})
    }
  }

  render(){
    return(
      <React.Fragment>
        {this.state.errors && this.state.errors.length > 0 ?
            <div className="ba b--red mt2">
            <p className="ml3 mt1 mb1">Errors</p>
              <ul>
                {this.state.errors.map( (e, index) => 
                  <li key={index}>{e}</li>
                )}
              </ul>
            </div>
            : null
        }
      </React.Fragment>
    )}

}

export default ErrorList
