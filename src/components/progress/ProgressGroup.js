
import classnames from 'classnames';
import ProgressBar from './ProgressBar';
import './Progress.less';

class ProgressGroup extends React.Component {
  static propTypes = {
    size: React.PropTypes.oneOf(['large', 'small']),
    striped: React.PropTypes.bool,
    active: React.PropTypes.bool,
    round: React.PropTypes.bool,
    className: React.PropTypes.string,
  };

  static defaultProps = {
    striped: false,
    active: false,
    round: false,
  };

  render() {
    const {className, striped, size, active, round, type, percent, dynamic} = this.props;    
    const clazzName = classnames({
      "neo-progress": true,
      "neo-progress-striped": !!striped,
      "neo-progress-round": !!round,
      "active": !!active,
      [`neo-progress-${size}`]: !!size,
      [`${className}`]: !!className,
    });
    return (
      <div className={clazzName} >
        {this.props.children}
      </div>
    );
  }
}

export default ProgressGroup;