/**
 * Created by ssehacker on 2016/10/18.
 */
import classnames from 'classnames';
import './Button.less';

class Button extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    type: React.PropTypes.oneOf(['normal', 'ok', 'cancel', 'create', 'delete', 'primary', 'default', 'dashed', 'info', 'success', 'warning', 'danger']),
    size: React.PropTypes.oneOf(['large', 'small']),
    disabled: React.PropTypes.bool,
    block: React.PropTypes.bool,
    className: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.node,
      React.PropTypes.element,
  ]),
    onClick: React.PropTypes.func,
  };

  static defaultProps = {
    name: '按钮',
    type: 'normal',
    icon: '',
    disabled: false,
    className: '',
  };

  handleClick(e) {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick(e);
    }
  }

  render() {
    const {className, type, size, disabled, block} = this.props;
    const clazzName = classnames({
      [`${className}`]: !!className,
      [`${type}Btn`]: !!type,
      [`${size}Btn`]: !!size,
      blockBtn: block,
      disabled: disabled,
    });
    const me = this;
    return (
      <button
        className={classnames({ 'neo-button': true, [`${clazzName}`]: !!clazzName })}
        onClick={me.handleClick.bind(me)}
      >
        { this.props.children || this.props.name }
      </button>
    );
  }
}

export default Button;
