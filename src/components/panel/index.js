/**
 * Created by ssehacker on 2016/10/10.
 */
import classnames from 'classnames';
import './Panel.less';

class Panel extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.array,
    ]).isRequired,
    title: React.PropTypes.string,
    subTitle: React.PropTypes.string,
  };

  render() {
    const me = this;
    return (
      <div className={classnames({ [`${me.props.className}`]: !!me.props.className, 'neo-panel': true })}>
        <div className="neo-title">
          <h4>{me.props.title}</h4>
          <p>{`${me.props.subTitle}`}</p>
        </div>
        <div className="neo-panel-content">{me.props.children}</div>
        <div className="neo-footer">
          <strong>Copyright&copy;2008-2016 华云数据版权所有</strong>
        </div>
      </div>
    );
  }
}

export default Panel;
