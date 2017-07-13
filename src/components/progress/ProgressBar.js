import classnames from 'classnames';
import './Progress.less';

class ProgressBar extends React.Component {
  static propTypes = {
    type: React.PropTypes.oneOf(['normal', 'primary', 'info', 'warning', 'success', 'danger']),
    dynamic: React.PropTypes.bool,
    percent: React.PropTypes.number,
    room: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {      
      type: this.props.type || 'normal',
    }
  }

  static defaultProps = {
    room: 100,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dynamic) {
      let percent = nextProps.percent;
      let room = this.props.room;
      let used = 100 - room;
      switch (true) {
        case percent + used >= 96:
          this.setState({
            type: "danger",
          });
          break;
        case percent + used >= 70:
          this.setState({
            type: "warning",
          });
          break;
        default:
          this.setState({
            type: this.props.type || 'normal',
          });
      }
    }
  }

  render() {
    const {percent} = this.props;
    const {type} = this.state;
    let status = null;
    switch (type) {
      case 'info':
        status = '（信息）';
        break;
      case 'warning':
        status = '（警告）';
        break;
      case 'success':
        status = '（成功）';
        break;
      case 'danger':
        status = '（危险）';
        break;
      default:
        status = '';
    };
    
    return (
      <div className={classnames({"neo-progress-bar": true, [`neo-progress-bar-${type}`]: true})} style={{width: `${percent}%`}} >
        <span className="sr-only">{percent}% 完成{status}</span>
      </div>
    );
  }
}

export default ProgressBar;