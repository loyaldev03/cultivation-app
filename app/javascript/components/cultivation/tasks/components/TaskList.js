import taskStore from './store/TaskStore'


class TaskList extends React.Component {
  render() {
    const list = taskStore.thelist.map((x, i) => <Item data={x} key={i} />
        return (<React.Fragment>{list}</React.Fragment>)

  }
}