import classnames from 'classnames';
import OptionItem from './OptionItem';
import './Option.less';

/* eslint jsx-a11y/no-static-element-interactions: 0 */
class Option extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
    };
  }

  renderOptions() {
    const { children } = this.props;
    const me = this;
    return children.map((item, index) => {
      const { onClick } = item.props;
      return React.cloneElement(item, {
        key: index,
        onClick() {
          me.setState({
            collapse: true,
          });
          onClick && onClick();
        },
      });
    });
  }

  handleBodyClick() {
    this.setState({
      collapse: false,
    });
  }

  handleBodyLeave() {
    this.bodyFlag = setTimeout(() => {
      this.setState({
        collapse: true,
      });
    }, 50);
  }

  handleMenuHover() {
    clearTimeout(this.bodyFlag);
  }

  handleMenuLeave() {
    this.setState({
      collapse: true,
    });
  }

  render() {
    const me = this;
    return (
      <div className="neo-options">
        <div
          className="neo-options-body"
          onClick={me.handleBodyClick.bind(me)}
          onMouseLeave={me.handleBodyLeave.bind(me)}
        >
          <button className="neo-options-title">操作 <span className="fa"> </span></button>
        </div>
        <ul
          className={classnames({ 'neo-options-drip-down': true, 'neo-hidden': me.state.collapse })}
          onMouseOver={me.handleMenuHover.bind(me)}
          onMouseLeave={me.handleMenuLeave.bind(me)}
        >
          { me.renderOptions() }
        </ul>
      </div>
    );
  }
}

Option.OptionItem = OptionItem;
export default Option;
