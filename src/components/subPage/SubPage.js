
import './SubPage.less';

class SubPage extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    title: React.PropTypes.string,
    loaded: React.PropTypes.bool,
  };

  renderChildren() {
    const { loaded } = this.props;
    let loadingImg = '/static/themes/neo-cu/images/loading.gif';
    if (window.env === 'dev') {
      loadingImg = '/images/loading.gif';
    }
    if (!loaded) {
      return (
        <div className="neo-err-msg">
          <img src={loadingImg} alt="正在加载" />
        </div>
      );
    }
    return this.props.children;
  }

  render() {
    const me = this;
    const { title } = this.props;
    return (
      <div className="neo-subPage">
        <h4 className="neo-subPage-title">{title}</h4>
        <div className="neo-subPage-body">
          {me.renderChildren()}
        </div>
      </div>
    );
  }
}

export default SubPage;
