/**
 * Created by ssehacker on 2016/10/19.
 */
import classnames from 'classnames';

class Input extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    required: React.PropTypes.bool,
  };

  static defaultProps = {
    required: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      warning: false,
    };
  }

  handleRequired(e) {
    const val = e.target.value;
    if (this.props.required) {
      if (!val) {
        this.setState({
          warning: true,
        });
      } else {
        this.setState({
          warning: false,
        });
      }
    }
  }

  render() {
    let { className, ...other } = this.props;
    className = classnames({
      [`${className}`]: !!className,
      'neo-input': true,
      warning: this.state.warning,
    });
    const props = { className, ...other };
    const me = this;
    return (
      <input onBlur={me.handleRequired.bind(me)} {...props} />
    );
  }
}

export default Input;
