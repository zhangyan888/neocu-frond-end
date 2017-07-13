/**
 * Created by ssehacker on 2016/10/10.
 */

import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import animate from 'css-animation';
import classnames from 'classnames';
import 'rc-menu/assets/index.css';
import menuContent from './config';
import '../../app/common.less';
import './Menu.less';

const animation = {
  enter(node, done) {
    let height;
    return animate(node, 'rc-menu-collapse', {
      start() {
        height = node.offsetHeight;
        node.style.height = 0;
      },
      active() {
        node.style.height = `${height}px`;
      },
      end() {
        node.style.height = '';
        done();
      },
    });
  },

  appear(...args) {
    return this.enter(...args);
  },

  leave(node, done) {
    return animate(node, 'rc-menu-collapse', {
      start() {
        node.style.height = `${node.offsetHeight}px`;
      },
      active() {
        node.style.height = 0;
      },
      end() {
        node.style.height = '';
        done();
      },
    });
  },
};

function handleSelect(info) {
  // console.log(info);
  // console.log(`selected ${info.key}`);
  location.href = info.key;
}

function onOpenChange(value) {
  console.log('onOpenChange', value);
}


class NeoMenu extends React.Component {
  static renderSubMenus() {
    const me = this;
    return menuContent.map((menu) => {
      console.log(menu.id);
      return (
        <SubMenu
          title={<span><i className={classnames({ iconfont: true, [`${menu.icon}`]: !!menu.icon })} /><span>{menu.title}</span></span>}
          key={menu.id}
        >
          {me.renderMenuItems(menu.subMenu)}
        </SubMenu>
      );
    });
  }

  static renderMenuItems(items) {
    return items.map(item =>
      <MenuItem
        key={item.url}
      >
        {item.title}
      </MenuItem>
    );
  }

  static defaultProps = {
    defaultOpenKeys: ['platformadmin'],
    defaultSelectedKeys: ['/platformadmin/user'],
  };

  static propTypes = {
    defaultOpenKeys: React.PropTypes.array,
    defaultSelectedKeys: React.PropTypes.array,
  };

  render() {
    return (
      <Menu
        onSelect={handleSelect}
        onOpenChange={onOpenChange}
        className="neo-menu"
        mode="inline"
        defaultOpenKeys={this.props.defaultOpenKeys}
        defaultSelectedKeys={this.props.defaultSelectedKeys}
        openAnimation={animation}
      >
        {NeoMenu.renderSubMenus()}
      </Menu>
    );
  }

}

export default NeoMenu;
