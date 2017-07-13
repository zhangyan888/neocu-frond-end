import classnames from 'classnames';
import './Tab.less';

class Tab extends React.Component {
  static propTypes = {
    defaultKey: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.array,
    ]),
  };

  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.props.defaultKey,
    };
  }

  getActivePanel() {
    return this.props.children.map((child) => {
      if (child.key === this.state.activeKey) {
        return React.cloneElement(child, { className: 'neo-tab-active' });
      }
      return child;
    });
  }

  switchPanel(key) {
    this.setState({
      activeKey: key,
    });
  }

  renderHeader() {
    const me = this;
    return me.props.children.map(child =>
      (
        <button
          className={classnames({ title: true, active: child.key === this.state.activeKey })}
          key={child.key}
          onClick={me.switchPanel.bind(me, child.key)}
        >
          {child.props.title}
        </button>
      ));
  }

  render() {
    const me = this;
    return (
      <div className="neo-tabs">
        <div className="neo-tabs-title">
          {me.renderHeader()}
        </div>
        <div className="neo-tabs-panel">
          {me.getActivePanel()}
        </div>
      </div>
    );
  }

}

class TabPanel extends React.Component {

  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.array,
    ]),
    className: React.PropTypes.string,
  };

  render() {
    const { className } = this.props;
    return (
      <div className={classnames({ 'neo-tab-panel': true, [className]: !!className })}>{this.props.children}</div>
    );
  }
}

Tab.TabPanel = TabPanel;
export default Tab;
