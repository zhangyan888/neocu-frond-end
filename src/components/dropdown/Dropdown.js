/**
 * Created on 2017/05/06.
 */
import classnames from 'classnames';
import Button from '../button';

import DropdownMenu from './DropdownMenu';
import DropdownMenuItem from './DropdownMenuItem';

class Dropdown extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    options: React.PropTypes.array,
    title: React.PropTypes.string,
    style: React.PropTypes.string,
    btnSize: React.PropTypes.oneOf(['large', 'small']),
    btnType: React.PropTypes.oneOf(['normal', 'ok', 'cancel', 'create', 'delete', 'primary', 'default', 'dashed', 'info', 'success', 'warning', 'danger']),
    placement: React.PropTypes.oneOf(['bottomRight', 'bottomCenter']),
    trigger: React.PropTypes.oneOf(['click', 'hover']),
  };

  static defaultProps = {
    title: '下拉列表',
    disabled: false,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      isFlag: false,
    };
    this.handleCollapse = this.handleCollapse.bind(this);
  };

  componentDidMount() {
    document.addEventListener('click', this.handleCollapse);
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleCollapse);
  };

  handleClick(callback, text,disable,e) {
		  if (disable) {
			  return;
		  }
		  if(typeof callback=='function'){
			  callback(e,text);
			  return;
		  }
  }

  handleToggle(e){
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    var isFlag = this.state.isFlag;
    this.setState({
      isFlag: !isFlag,
    })
  };

  handleDropDown (e) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      isFlag: true,
    });
  }

  handleDropUp (e) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      isFlag: false,
    });
  }

  handleCollapse(e) {
    if (this.state && this.state.isFlag) {
      this.setState({
        isFlag: false,
      });
    }
  };

  render() {
    const {title, options, disabled, btnSize, isButton, btnType, style, className, placement, trigger} = this.props;
    const me = this;
    return (
        <DropdownMenu 
          title={title} 
          disabled={disabled} 
          size={btnSize} 
          isButton={isButton} 
          type={btnType} 
          className={className} 
          style={style} 
          placement={placement} 
          trigger={trigger} 
          isFlag={me.state.isFlag}
          collapse={me.handleCollapse.bind(me)}
          toggle={me.handleToggle.bind(me)}
          dropdown={me.handleDropDown.bind(me)}
          dropup={me.handleDropUp.bind(me)}
        >
            {
                options.map(item => (
                    <DropdownMenuItem 
                      key={item.id} 
                      onClick={me.handleClick.bind(me, item.callback, item.name,item.disable)}
                      collapse={me.handleCollapse.bind(me)}
                      disabled={item.disable}
                    >
                      {item.name}
                    </DropdownMenuItem>
                ))
            }
        </DropdownMenu>      
    );
  }
}

export default Dropdown;