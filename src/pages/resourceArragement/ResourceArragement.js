import classnames from 'classnames';
import '../../app/common.less';
import '../../app/commonForm.less';
import './forms/Forms.less';
import './ResourceArragement.less';
import { error, success } from '../../components/dialog';
import configUtil from './configUtil';
import { Block, Path, DynamicMenu, util } from './widgets';
import { throttle } from '../../util';
import { ADD_BLOCK, ADD_CONNECTION } from './constant';
import { modal } from './reducers';
import * as action from './actions';

const unescape = require('lodash.unescape');
/* const blockSetting = {
  width: 75,
  height: 100,
};*/

function setBlockData(e, data) {
  e.dataTransfer.setData('text', `{"action": "${ADD_BLOCK}", "data": "${data}"}`);
}

function getStash() {
  const source = util.getSource();
  let res;
  if (source && source.template) {
    try {
      res = util.parseForms(source);
    } catch (e) {
      console.error(e);
    }
  }
  return res;
}

class ResourceArragement extends React.Component {

  static childContextTypes = {
    dispatch: React.PropTypes.func,
  };

  static renderMenu() {
    return configUtil.getAllMenu().map(item => (
      <div
        key={item.name}
        className="neo-ra-menu-item"
        draggable="true"
        onDragStart={e => setBlockData(e, item.type)}
      >
        <p><i className={classnames({ iconfont: true, [item.icon]: true })} /></p>
        <span>{item.name}</span>
      </div>
    ));
  }

  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      connections: [],
      startPoint: null,
      endPoint: null,
    };

    this.handleBlockDrag = throttle(function (blockId, e, data) {
      let { blocks } = this.state;
      blocks = blocks.map((item) => {
        if (item.id === blockId) {
          return {
            ...item,
            x: data.x,
            y: data.y,
          };
        }
        return item;
      });
      this.setState({
        blocks,
      });
    }, 5);
  }

  componentWillMount() {
    const stash = getStash();
    let blocks;
    let connections;
    if (stash) {
      blocks = stash.blocks;
      connections = stash.connections;
      this.setState({
        blocks,
        connections,
      });
    } else {
      this.handleRestore();
    }
  }

  handleRestore() {
    modal.call(this, this.state, action.restoreData());
  }

  getChildContext() {
    return {
      dispatch: (action) => {
        const state = modal.call(this, this.state, action);
        this.setState(state);
      },
    };
  }

  renderBlocks() {
    const { blocks } = this.state;
    const me = this;
    const { handleBlockDrag, addConnection, setStartPoint, setEndPoint } = this;
    return blocks.map(block => (
      <Block
        {...block}
        key={block.id}
        handleDrag={handleBlockDrag.bind(me, block.id)}
        addConnection={addConnection.bind(me, block.id)}
        setStartPoint={setStartPoint.bind(me)}
        style={{ width: `${block.width}px`, height: `${block.height}px` }}
      />
    ));
  }

  save() {
    const state = modal.call(this, this.state, action.saveForms());
    this.setState(state);
  }

  publish() {
    const state = modal.call(this, this.state, action.publishForms());
    this.setState(state);
  }

  clear() {
    const state = modal.call(this, this.state, action.clearForms());
    this.setState(state);
  }

  getBlock(blockId) {
    const { blocks } = this.state;
    return blocks.find(item => item.id === blockId);
  }

  addConnection(blockId, e) {
    e.stopPropagation();
    this.clearBootstrapLine();
    let res = e.dataTransfer.getData('Text');
    let fromId;
    let action;
    try {
      res = JSON.parse(res);
      action = res.action;
      fromId = res.data;
    } catch (err) {
      console.error(err.message);
      return;
    }
    if (action !== ADD_CONNECTION) {
      return;
    }
    const toId = blockId;
    if (fromId === toId) {
      return;
    }
    const fromBlock = this.getBlock(fromId);
    const toBlock = this.getBlock(toId);
    if (!configUtil.connectable(fromBlock.type, toBlock.type)) {
      error('此两个模块不能相连');
      return;
    }
    const { connections } = this.state;
    // const me=this;
    // let results=[];
    // connections.forEach(item=>{
    //   const toItem=me.getBlock(item.to),fromItem=me.getBlock(item.from);
    //   if(toItem.type.toLowerCase()==='ip' && fromItem.type.toLowerCase()==='router'){
    //     results.push(false);
    //     return;
    //   }
    //   if(toItem.type.toLowerCase()==='router' && fromItem.type.toLowerCase()==='ip'){
    //     results.push(false);
    //     return;
    //   }
    //   results.push(true);
    // });
    // if(results.filter(item=>item.toString()==='false').length>0){
    //   error('该模块不能同时连接两个资源。');
    //   return;
    // }
    const duplicate = connections.filter(item => (
      (item.from === fromId && item.to === toId) || (item.from === toId && item.to === fromId)
    ));
    if (duplicate && !duplicate.length) {
      connections.push({
        from: fromId,
        to: toId,
      });
      this.setState({
        connections,
      });
    }
  }

  getOffset(elem) {
    let left = 0;
    let top = 0;
    do {
      if (!isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
        left += elem.offsetLeft;
        top += elem.offsetTop;
      }
    } while ((elem = elem.offsetParent));
    return {
      left,
      top,
    };
  }

  setStartPoint(startPoint, mousePos) {
    this.originMousePos = mousePos;
    this.setState({
      startPoint,
      endPoint: startPoint,
    });
  }

  setEndPoint(mousePos) {
    const { startPoint } = this.state;
    this.setState({
      endPoint: {
        x: (startPoint.x + mousePos.x) - this.originMousePos.x,
        y: (startPoint.y + mousePos.y) - this.originMousePos.y,
      },
    });
  }

  clearBootstrapLine() {
    // console.log('clearBootstrapLine...');
    this.originMousePos = null;
    this.setState({
      startPoint: null,
      endPoint: null,
    });
  }

  addBlock(e) {
    this.clearBootstrapLine();
    const data = e.dataTransfer.getData('Text');
    let type;
    let action;
    try {
      const res = JSON.parse(data);
      action = res.action;
      type = res.data;
    } catch (err) {
      console.error(err.message);
      return;
    }

    if (action !== ADD_BLOCK) {
      return;
    }

    const mouseX = e.pageX;
    const mouseY = e.pageY;
    const { left, top } = this.getOffset(e.currentTarget);
    const containerLeft = left;
    const containerTop = top;

    const { blocks } = this.state;
    const blockTmpl = configUtil.getBlock(type);

    const x = (mouseX - containerLeft) - (blockTmpl.width / 2);
    const y = (mouseY - containerTop) - (blockTmpl.height / 2);
    blocks.push({
      ...blockTmpl,
      id: String(Date.now()),
      name: blockTmpl.name,
      x,
      y,
    });
    this.setState({
      blocks,
    });
  }

  renderConnections() {
    let { connections, blocks } = this.state;
    blocks = util.indexBy(blocks, 'id');
    connections = connections.map(item => ({
      from: blocks[item.from],
      to: blocks[item.to],
    }));
    return connections.map((conn, index) => <Path key={index} {...conn} />);
  }

  renderOptions() {
    const me = this;
    if (util.isReadOnly()) {
      return null;
    }
    return (
      <div className="neo-ra-option">
        <div
          className="neo-ra-option-item"
          onClick={me.save.bind(me)}
        >
          <i className="iconfont icon-save" />
          <span>{i18n('Save')}</span>
        </div>
        <div
          className="neo-ra-option-item"
          onClick={me.publish.bind(me)}
        >
          <i className="iconfont icon-upload" />
          <span>{i18n('Publish')}</span>
        </div>
        <div
          className="neo-ra-option-item"
          onClick={me.clear.bind(me)}
        >
          <i className="iconfont icon-shanchu" />
          <span>{i18n('Empty')}</span>
        </div>
      </div>
    );
  }

  renderBootstrapLine() {
    const { startPoint, endPoint } = this.state;
    // console.log('render', startPoint, endPoint);
    if (startPoint && endPoint) {
      const points = [startPoint, endPoint];
      return (
        <Path points={points} />
      );
    }
    return null;
  }

  handleMouseMove(e) {
    e.preventDefault();
    const clientX = e.clientX;
    const clientY = e.clientY;
    clearTimeout(this.moveFlag);
    this.moveFlag = setTimeout(() => {
      if (this.originMousePos) {
        this.setEndPoint({
          x: clientX,
          y: clientY,
        });
      }
    }, 5);
  }

  render() {
    const me = this;
    return (
      <div
        className="neo-resource-arragement"
      >
        <div className="neo-ra-menu">
          {ResourceArragement.renderMenu()}
          {me.renderOptions()}
        </div>
        <div
          className="neo-ra-body"
          onDrop={me.addBlock.bind(me)}
          onDragOver={me.handleMouseMove.bind(me)}
        >
          <div className="neo-ra-body-bg" />
          <svg className="neo-path">
            {me.renderConnections()}
            {me.renderBootstrapLine()}
          </svg>
          {me.renderBlocks()}
          <DynamicMenu blocks={me.state.blocks}/>
        </div>
        <div style={{ display: 'none' }} className="neo-form-virtual" />
      </div>
    );
  }

  componentWillUnmount() {
    clearInterval(this.auto);
  }
}

export default ResourceArragement;
