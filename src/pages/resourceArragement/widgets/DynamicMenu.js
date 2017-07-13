/**
 * Created by ssehacker on 2017/3/22.
 */

import { ContextMenu, MenuItem, ContextMenuTrigger, connectMenu } from 'react-contextmenu';
import { DYNAMIC } from '../constant';
import configUtil from '../configUtil';

class DynamicMenu extends React.Component {
  static contextTypes = {
    dispatch: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  handleClick(e, data) {
    // doAction()
    const { dispatch } = this.context;
    console.log(data.type, data);
    dispatch({
      type: `${data.name}_FORM_${data.type}`.toUpperCase(),
      blockId: data.targetId,
      blockType: data.type,
      title: data.text,
    });
  }

  renderMenuItem(type) {
    const me = this;
    const {blocks,trigger}=this.props;
    let disabled=false;
    if(type==='listen'){
      const target=blocks.find(item=>item.id===trigger.targetId);
      const protocol=target.form.protocol;
      if(protocol==='tcp'){
        disabled=true;
      }
    }
    if (type) {
      const actions = configUtil.getActions(type);
      return actions.map(item => {
        if(item.name==='managePolicy' && disabled===true){
          return(<MenuItem key={item.name} data={item} onClick={me.handleClick.bind(me)} disabled={disabled} className="disabled">
            {item.text}
          </MenuItem>)
        }else{
          return(
            <MenuItem key={item.name} data={item} onClick={me.handleClick.bind(me)}>
              {item.text}
            </MenuItem>
          )
        }
      });
    }
    return null;
  }

  render() {
    const me = this;
    const { id, trigger } = this.props;
    const handleItemClick = trigger ? trigger.onItemClick : null;

    const type = trigger && trigger.type;
    return (
      <ContextMenu id={id}>
        {me.renderMenuItem(type)}
      </ContextMenu>
    );

  }
}

export default connectMenu(DYNAMIC)(DynamicMenu);
