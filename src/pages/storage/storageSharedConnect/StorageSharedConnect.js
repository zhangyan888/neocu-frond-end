import classnames from 'classnames';
import '../../../app/common.less';
import './StorageSharedConnect.less';

import { error, success } from '../../../components/dialog';
import Form from '../../../components/form';
import { request, Msg } from '../../../util';

const { Input } = Form;
const i18n = top.gettext;

class StorageSharedConnectMgmt extends React.Component {

  constructor(props) {
    super(props);
    this.baseUrl = `/project/storage/${this.props.volume_id}/shared_volume_api/`;
    this.state = {
      loading: false,
      list: [],
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    const url = this.baseUrl;
    request.get(url)
      .then((res) => {
        if (res.ok) {
          let list = [].concat(res.data.attached).concat(res.data.available);
          list = list.map(item => ({
            ...item,
            selected: item.device !== undefined,
          }));
          this.originList = JSON.parse(JSON.stringify(list));
          this.setState({
            list,
          });
        } else {
          error(res.msg);
        }
      })
      .catch((e) => {
        console.error(e);
        error(Msg.OPERATE_ERROR);
      });
  }

  toggleItem(id) {
    const list = this.state.list.map((item) => {
      if (item.id === id) {
        item.selected = !item.selected;
      }
      return item;
    });
    this.setState({
      list,
    });
    this.props.getList(this.state.list);
  }

  renderUnSelectedList() {
    const me = this;
    return this.state.list
      .filter(item => !item.selected)
      .map(item => (
        <li key={item.id} className={classnames({ 'neo-hidden': item.hidden })}>
          <a>{item.name}</a>
          <i className="iconfont icon-plus" onClick={me.toggleItem.bind(me, item.id)} />
        </li>
      ));
  }

  renderSelectedList() {
    const me = this;
    return this.state.list
      .filter(item => item.selected)
      .map(item => (
        <li key={item.id} className={classnames({ 'neo-hidden': item.hidden })}>
          <h4><a>{item.name}</a><i className="iconfont icon-minus" onClick={me.toggleItem.bind(me, item.id)} /></h4>
          <p>{item.device || '-'}</p>
        </li>
      ));
  }

  handleSearchUnSelected(e) {
    const val = e.target.value;
    let list = this.state.list;
    list = list.map((item) => {
      if (item.selected) {
        return { ...item };
      }
      return {
        ...item,
        hidden: item.name.indexOf(val) === -1,
      };
    });
    this.setState({
      list,
    });
  }

  handleSearchSelected(e) {
    const val = e.target.value;
    let list = this.state.list;
    list = list.map((item) => {
      if (!item.selected) {
        return { ...item };
      }
      return {
        ...item,
        hidden: item.name.indexOf(val) === -1,
      };
    });
    this.setState({
      list,
    });
  }

  render() {
    console.log(1111);
    const me = this;
    const { loading } = me.state;
    const loadingImg = window.env === 'dev' ? '../../images/loading.gif' : '/static/themes/neo-cu/images/loading.gif';
    const showNoDataUnSelected = this.state.list.filter(item => !item.selected && !item.hidden).length === 0;
    const showNoDataSelected = this.state.list.filter(item => item.selected && !item.hidden).length === 0;
    return (
      <div className="neo-storageSharedConnectMgmt">
        <div className="neo-storageSharedConnectMgmt-body">
          <p>{i18n('将共享盘连接到云主机或从云主机分离。从云主机分离后，数据会保存在共享盘上，可被其他连接了该共享盘的云主机读取。您最多可以将共享盘连接到10台云主机。')}</p>
          <div className="neo-storage-shared-conn-mgmt">
            <div className="neo-storage-unselected">
              <p>{i18n('选择希望连接的云主机')}</p>
              <div className="neo-storage-search">
                <Input placeholder={i18n('请输入云主机名称')} onChange={me.handleSearchUnSelected.bind(me)} />
                <iconfont className="iconfont icon-search" />
              </div>
              <ul>
                <li className={classnames({ 'neo-hidden': !showNoDataUnSelected, 'neo-no-data': true })}>{i18n('No results match')}</li>
                {me.renderUnSelectedList()}
              </ul>
            </div>
            <div className="neo-storage-selected">
              <p>{i18n('选择希望分离的云主机')}</p>
              <div className="neo-storage-search">
                <Input placeholder={i18n('请输入云主机名称')} onChange={me.handleSearchSelected.bind(me)} />
                <iconfont className="iconfont icon-search" />
              </div>
              <ul>
                <li className={classnames({ 'neo-hidden': !showNoDataSelected, 'neo-no-data': true })}>{i18n('No results match')}</li>
                {me.renderSelectedList()}
              </ul>
            </div>
          </div>
          <div className="neo-loading" style={{ display: loading ? 'flex' : 'none' }} >
            <img alt="loading" src={loadingImg} />
          </div>
        </div>
      </div>
    );
  }
}

export default StorageSharedConnectMgmt;
