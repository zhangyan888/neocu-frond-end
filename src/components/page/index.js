/**
 * Created by ssehacker on 2016/10/10.
 */
import Menu from '../menu';
import Panel from '../panel';
import Header from '../header';
import './Page.less';

class Page extends React.Component {

  static propTypes = {
    defaultOpenKeys: React.PropTypes.array,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.array,
    ]).isRequired,
    defaultSelectedKeys: React.PropTypes.array,
    title: React.PropTypes.string,
    subTitle: React.PropTypes.string,
  };

  render() {
    return (
      <div className="neo-page">
        <Header />
        <Menu
          defaultOpenKeys={this.props.defaultOpenKeys}
          defaultSelectedKeys={this.props.defaultSelectedKeys}
        />
        <Panel
          className="neo-container"
          title={this.props.title}
          subTitle={this.props.subTitle}
        >{this.props.children}</Panel>
      </div>
    );
  }
}

export default Page;
