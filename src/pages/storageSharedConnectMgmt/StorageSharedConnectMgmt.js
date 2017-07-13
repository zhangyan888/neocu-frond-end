import classnames from 'classnames';
import '../../app/common.less';
import './StorageSharedConnectMgmt.less';
// import SubPage from '../../components/subPage';
import { error, success } from '../../components/dialog';
import Form from '../../components/form';
import { request, Msg } from '../../util';

const { Input } = Form;
const i18n = top.gettext;

class StorageSharedConnectMgmt extends React.Component {

  constructor(props) {
    super(props);
    this.baseUrl = `/project/storage/${window.volume_id}/shared_volume_api/`;
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

  handleSubmit(e) {
    if (this.state.loading) {
      return;
    }
    const me = this;
    const list = this.state.list;
    const originList = this.originList;
    const attach = [];
    const detach = [];

    for (let i = 0; i < originList.length; i += 1) {
      for (let j = 0; j < list.length; j += 1) {
        if (originList[i].id === list[j].id) {
          if (originList[i].selected !== list[j].selected) {
            if (list[j].selected) {
              attach.push(list[j].id);
            } else {
              detach.push(list[j].id);
            }
          }
          break;
        }
      }
    }
    me.setState({
      loading: true,
    });
    const target = e.target;
    request.put(this.baseUrl, {
      attach,
      detach,
    }).then((res) => {
      if (res.ok) {
        success(Msg.OPERATE_SUCCESS);
        $(target).parent().find('.neo-cancel-btn').click();
      } else {
        error(res.msg);
      }
      me.setState({
        loading: false,
      });
    }).catch(() => {
      error(Msg.OPERATE_ERROR);
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
          <p>{i18n('Attach shared volumes to instances or detach them from instances.Once detached, data will reserve in shared volumes and can be read by other instances which attached these volumes.You can attach them to 10 instances at most.')}</p>
          <div className="neo-storage-shared-conn-mgmt">
            <div className="neo-storage-unselected">
              <p>{i18n('Instances that can be attached to')}</p>
              <div className="neo-storage-search">
                <Input placeholder={i18n('Please input instance name')} onChange={me.handleSearchUnSelected.bind(me)} />
                <iconfont className="iconfont icon-search" />
              </div>
              <ul>
                <li className={classnames({ 'neo-hidden': !showNoDataUnSelected, 'neo-no-data': true })}>{i18n('No results match')}</li>
                {me.renderUnSelectedList()}
              </ul>
            </div>
            <div className="neo-storage-selected">
              <p>{i18n('Instances that can be detached from')}</p>
              <div className="neo-storage-search">
                <Input placeholder={i18n('Please input instance name')} onChange={me.handleSearchSelected.bind(me)} />
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
        <div className="modal-footer">
          <a className="btn btn-default neo-cancel-btn" data-dismiss="modal">{i18n('Cancel')}</a>
          <a className="btn btn-primary" onClick={me.handleSubmit.bind(me)}>{i18n('Create')}</a>
        </div>
      </div>
    );
  }
}

export default StorageSharedConnectMgmt;
