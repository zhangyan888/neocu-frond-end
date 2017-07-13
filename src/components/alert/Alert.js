import classnames from 'classnames';
import './Alert.less';

class Alert extends React.Components {

  static propTypes = {
    type: React.PropTypes.oneOf(['default', 'info', 'success', 'warning', 'danger']),
    close: React.PropTypes.bool,
    title: React.PropTypes.string,
    className: React.PropTypes.string,
    children: React.PropTypes.oneOfType([      
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.node,
    ]),
  }

  static defaultProps = {
    type: 'default',
  }

  constructor (props) {
    super(props);
  }

  render() {
    const {type, close, title, children} = this.props;
    return (
      <div className={classnames({"neo-warning": true, [`neo-warning-${type}`]: !!type, [`${className}`]: !!className})} >

      </div>
    )
  }
}

export default Alert;