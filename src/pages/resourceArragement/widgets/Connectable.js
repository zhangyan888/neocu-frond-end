/**
 * Created by ssehacker on 2017/3/20.
 */

class Connectable extends React.Component {
  // static dragStart(e, data) {
  //   e.dataTransfer.setData('text/plain', `{"action": "ADD_CONNECTION", "data": ${JSON.stringify(data)}`);
  // }

  constructor(props) {
    super(props);
  }

  render() {
    const { children, data, connect } = this.props;
    /*return React.cloneElement(children, {
      draggable: true,
      onDragStart: (e) => { Connectable.dragStart(e, data); },
      onDragOver: (e) => { e.preventDefault(); },
      onDrop: connect,
    });*/
    return children;
  }
}

export default Connectable;
