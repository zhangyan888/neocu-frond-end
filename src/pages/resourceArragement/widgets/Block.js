/**
 * Created by ssehacker on 2017/3/20.
 */
import classnames from 'classnames';
import Draggable, { DraggableCore } from 'react-draggable';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Connectable from './Connectable';
import { ADD_CONNECTION, DYNAMIC } from '../constant';

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.state = {
      selected: false,
    };
  }

  handleClick(e) {
    console.log(e);
  }

  dragStart(e, id) {
    const { setStartPoint, setEndPoint, x, y, width, height } = this.props;
    setStartPoint({
      x: x + (width / 2),
      y: y + height,
    }, {
      x: e.clientX,
      y: e.clientY,
    });
    // console.log(`start:${e.clientX}, ${e.clientY}`);
    e.dataTransfer.setData('text', `{"action": "${ADD_CONNECTION}", "data": "${id}"}`);
  }

  handleEnter(e) {
    e.preventDefault();
    this.count += 1;
    if (this.count > 0) {
      this.setState({
        selected: true,
      });
    }
  }

  handleLeave(e) {
    e.preventDefault();
    this.count -= 1;
    if (this.count <= 0) {
      this.setState({
        selected: false,
      });
    }
  }

  handleDrop(e) {
    const { addConnection } = this.props;
    addConnection(e);
    this.count = 0;
    this.setState({
      selected: false,
    });
  }

  renderBody() {
    const { icon, color, name } = this.props;
    if (icon) {
      return (
        <i className={classnames({ iconfont: true, [icon]: true })} style={{ color }} />
      );
    }
    return (
      <span style={{ color }}>{name}</span>
    );
  }

  render() {
    const me = this;
    const { selected } = this.state;
    const { name, id, type, color, x, y, handleDrag, style, form } = this.props;
    style.borderColor = color;
    return (
      <Draggable
        position={{ x, y }}
        bounds="parent"
        cancel="cite.neo-no-drag"
        onDrag={handleDrag}
        onStop={handleDrag}
      >
        <div
          className={classnames({ 'neo-ra-body-block': true, 'neo-ra-block-selected': selected })}
          onDrop={me.handleDrop.bind(me)}
          onDragOver={(e) => { e.preventDefault(); }}
          onDragEnter={me.handleEnter.bind(me)}
          onDragLeave={me.handleLeave.bind(me)}
          style={style}
        >
          <ContextMenuTrigger
            id={DYNAMIC}
            holdToDisplay={-1}
            collect={props => props}
            onItemClick={me.handleClick.bind(me)}
            targetId={id}
            type={type}
          >
            <p>{me.renderBody()}</p>
            <Connectable>
              <cite
                className="neo-no-drag"
                style={{ background: color }}
                draggable="true"
                onDragStart={(e) => { me.dragStart(e, id); }}
                onDragOver={(e) => { e.preventDefault(); }}
              >{(form && form.name) || name}</cite>
            </Connectable>
          </ContextMenuTrigger>
        </div>
      </Draggable>
    );
  }
}

export default Block;
