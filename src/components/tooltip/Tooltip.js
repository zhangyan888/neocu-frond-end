
import classnames from 'classnames';
import './Tooltip.less';

class Tooltip extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    placement: React.PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
    title: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.node,
    ]),
    tips: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.node,
    ]),
    // trigger: React.PropTypes.oneOf(['click', 'hover']),
  };

  static defaultProps = {
    title: '提示工具',
    placement: 'top',
  };
  
  constructor(props) {
    super(props);
    this.state = {
      isFlag: false,
    };
    this.showAction = this.showAction.bind(this);
    this.hideAction = this.hideAction.bind(this);
  };

  showAction() {
    this.setState({
      isFlag: true,
    });
  }

  hideAction() {
    this.setState({
      isFlag: false,
    });
  }

  renderTittle() {
    const {title} = this.props;

    return (
      <a
        // onClick={this.showAction}
        onMouseEnter={this.showAction}
        onMouseLeave={this.hideAction}
      >
      {title}
      </a>
    );
  }

  renderTip() {
    const tips = this.props.tips;
    const isFlag = this.state.isFlag;
    const tipDiv = isFlag ? <div className="neo-tips-content"><span className="neo-tips">{tips}</span></div> : null;
    return tipDiv;
  }

  render() {
    const {className, placement } = this.props;
    return (
        <div className={classnames({"neo-tooltip": true, [`${className}`]: !!className, [`neo-tooltip-${placement}`]: !!placement})}>
            {this.renderTittle()}
            {this.renderTip()}
        </div>      
    );
  }
}

export default Tooltip;