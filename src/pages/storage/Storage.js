import service from '../../services';
import { error, success } from '../../components/dialog';
import { handleResError, indexBy } from '../../util';
import EntityList from '../../components/entityList';
import Option from '../../components/option';
import Form from '../../components/form';
import Button from '../../components/button';
import Search from '../../components/search';
import { modal } from './reducers';
import * as action from './actions';
import '../../app/common.less';
import '../../app/commonForm.less';
import './forms/Form.less';
import './Storage.less';

const { OptionItem } = Option;
const { CheckBox } = Form;

class Storage extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      rows: [],
      hasMoreData: false,
      hasPrevData: false,
      allSelected: false,
      createEnable: true,
      deleteEnable: true,
    };
    this.init();
  }

  componentDidMount() {
    modal.call(this, this.state, action.fetchStorageList());
  }

  toggleAll(e) {
    let { rows } = this.state;

    const allSelected = e.target.checked;
    rows = rows.map(item =>({
      ...item,
      select: allSelected,
    }));
    this.setState({
      rows,
      allSelected,
    });
  }

  toggleRecord(rowNum, e) {
    const { rows } = this.state;
    rows[rowNum].select = e.target.checked;
    const shouldUnselected = rows.find(item => !item.select);
    this.setState({
      rows,
      allSelected: !shouldUnselected,
    });
  }

  pageDown() {
    const { rows } = this.state;
    let lastResourceId;
    if (!rows.length) {
      lastResourceId = this.lastRowId;
    } else {
      lastResourceId = rows[rows.length - 1].id;
    }

    modal.call(this, this.state, action.fetchStorageList(this.query, lastResourceId, true));
  }

  pageUp() {
    const { rows } = this.state;
    let firstResourceId;
    if (!rows.length) {
      firstResourceId = this.firstRowId;
    } else {
      firstResourceId = rows[0].id;
    }

    modal.call(this, this.state, action.fetchStorageList(this.query, firstResourceId, false));
  }

  createStorage() {
    modal.call(this, this.state, action.createStorage());
  }

  removeStorages() {
    modal.call(this, this.state, action.removeAllStorage());
  }

  handleSearch(option, value, e) {
    console.log(`search:${option}:${value}`);
    this.query = [option, value].join('=');
    modal.call(this, this.state, action.fetchStorageList(this.query));
  }

  getAdminColumns() {
    const me = this;
    /*const columns = [{
      title: <CheckBox onChange={me.toggleAll.bind(me)} />, dataIndex: 'select', key: 'select', width: 50, render: () => (<CheckBox onChange={me.toggleRecord.bind(me)} />),
    }, {
      title: '项目', dataIndex: 'project', key: 'project', width: 100,
    }, {
      title: 'ID', dataIndex: 'id', key: 'id', width: 200, render: value => (<a href="#">{value}</a>),
    }, {
      title: '名称', dataIndex: 'name', key: 'name', width: 200, render: value => (<a href="#">{value}</a>),
    }, {
      title: '大小 (GB)', dataIndex: 'size', key: 'size', width: 100,
    }, {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
    }, {
      title: '类型', dataIndex: 'type', key: 'type', width: 100,
    }, {
      title: '共享盘', dataIndex: 'shared', key: 'shared', width: 100,
    }, {
      title: '可启动', dataIndex: 'bootable', key: 'bootable', width: 100,
    }, {
      title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150,
    }, {
      title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', width: 150,
    }, {
      title: '操作', dataIndex: 'option', key: 'option', width: 100, render: (value, row, index) => (
        <Option>
          <OptionItem onClick={() => { modal.call(me, me.state, action.editStorage(data[index])); }}>编辑云硬盘</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.removeStorage(data[index].id)); }}>删除云硬盘</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.manageConnection()); }}>管理连接</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.createSnapshoot()); }}>创建快照</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.resizeStorage(data[index])); }}>云硬盘扩容</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.autoSnapshoot()); }}>自动快照</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.copyStorage()); }}>复制云硬盘</OptionItem>
        </Option>
      ),
    }];*/
  }

  getColumns() {
    const me = this;
    const { rows, allSelected } = me.state;
    const statusEnume = indexBy(this.statusEnume, 'id');
    const i18nContext = 'Current status of a Volume';
    const columns = [{
      title: <CheckBox checked={allSelected} onChange={me.toggleAll.bind(me)} />, dataIndex: 'select', key: 'select', width: 50, render: (value, row, index) => {
        return (<CheckBox checked={!!value} onChange={me.toggleRecord.bind(me, index)} />);
      },
    }, {
      title: 'ID', dataIndex: 'id', key: 'id', width: 200, render: (value, row) => (<a href={`/project/storage/${row.id}/`}>{value}</a>),
    }, {
      title: '名称', dataIndex: 'name', key: 'name', width: 200, render: (value, row) => (<a href={`/project/storage/${row.id}/`}>{value}</a>),
    }, {
      title: '大小', dataIndex: 'size', key: 'size', width: 100, render: (value) => `${value} GB`,
    }, {
      title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (value) => {
        return i18n(statusEnume[value].name, i18nContext);
      },
    }, {
      title: '类型', dataIndex: 'volume_type', key: 'volume_type', width: 100,
    }, {
      title: '共享盘', dataIndex: 'multiattach', key: 'multiattach', width: 100, render: (value) => {
        return value ? '是' : '否';
      },
    }, {
      title: '可启动', dataIndex: 'bootable', key: 'bootable', width: 100, render: (value) => {
        return value ? '是' : '否';
      },
    }, {
      title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 150,
    }, {
      title: '修改时间', dataIndex: 'updated_at', key: 'updated_at', width: 150, render: (value, row) => {
        return value || row.created_at;
      },
    }, {
      title: '操作', dataIndex: 'actions', key: 'actions', width: 100, render: (value, row, index) => {
        const actions = indexBy(row.actions, 'id');
        return (
        <Option>
          <OptionItem
            disable={!!actions.edit && !actions.edit.enabled}
            onClick={() => { modal.call(me, me.state, action.editStorage(row)); }}
          >编辑云硬盘</OptionItem>
          <OptionItem
            disable={!!actions.delete && !actions.delete.enabled}
            onClick={() => { modal.call(me, me.state, action.removeStorage(row.id)); }}
          >删除云硬盘</OptionItem>
          <OptionItem
            disable={!!actions['edit-attachments'] && !actions['edit-attachments'].enabled}
            onClick={() => { modal.call(me, me.state, action.manageConnection(row.id, row.multiattach)); }}
          >管理连接</OptionItem>
          <OptionItem
            disable={!!actions['create-snapshot'] && !actions['create-snapshot'].enabled}
            onClick={() => { modal.call(me, me.state, action.createSnapshoot(row.id)); }}
          >创建快照</OptionItem>
          <OptionItem
            disable={!!actions['extend-volume'] && !actions['extend-volume'].enabled}
            onClick={() => { modal.call(me, me.state, action.resizeStorage(row)); }}
          >云硬盘扩容</OptionItem>
          <OptionItem
            disable={!!actions['auto-snapshot'] && !actions['auto-snapshot'].enabled}
            onClick={() => { modal.call(me, me.state, action.autoSnapshoot(row.id)); }}
          >自动快照</OptionItem>
          <OptionItem
            disable={!!actions['copy-volume'] && !actions['copy-volume'].enabled}
            onClick={() => { modal.call(me, me.state, action.copyStorage(row.id)); }}
          >复制云硬盘</OptionItem>
        </Option>
      )},
    }];

    return columns;
  }

  init() {
    this.statusEnume = [
      {
        id: 'available',
        name: 'Available',
      },{
        id: 'in-use',
        name: 'In-use',
      },{
        id: 'error',
        name: 'Error',
      },{
        id: 'creating',
        name: 'Creating',
      },{
        id: 'downloading',
        name: 'Downloading',
      },{
        id: 'restoring',
        name: 'Restoring',
      },{
        id: 'error_extending',
        name: 'Error Extending',
      },{
        id: 'extending',
        name: 'Extending',
      },{
        id: 'attaching',
        name: 'Attaching',
      },{
        id: 'detaching',
        name: 'Detaching',
      },{
        id: 'deleting',
        name: 'Deleting',
      },{
        id: 'error_deleting',
        name: 'Error deleting',
      },{
        id: 'backing-up',
        name: 'Backing Up',
      },{
        id: 'restoring-backup',
        name: 'Restoring Backup',
      },{
        id: 'error_restoring',
        name: 'Error Restoring',
      },{
        id: 'maintenance',
        name: 'Maintenance',
      },{
        id: 'rolling-back',
        name: 'Rolling Back',
      },
    ];
  }

  render() {
    const { loaded } = this.state;
    const me = this;
    const searchOption = [
      {
        id: 'name',
        name: '名称',
      },
    ];

    const columns = this.getColumns();
    let { rows, hasPrevData, hasMoreData, createEnable, deleteEnable } = this.state;
    rows = rows.map(item => ({
      ...item,
      key: item.id,
    }));

    const isDeleteBtnEnable = rows.find(item => item.select);
    return (
      <div className="neo-entity">
        <div className="neo-entity-option m-b">
          <p>
            <Button disabled={!createEnable} className="m-r" onClick={me.createStorage.bind(me)}>创建云硬盘</Button>
            <Button disabled={deleteEnable ? !isDeleteBtnEnable : true} onClick={me.removeStorages.bind(me)}>删除云硬盘</Button>
          </p>
          <Search onSearch={me.handleSearch.bind(me)} config={searchOption} />
        </div>
        <EntityList
          columns={columns}
          data={rows}
          pageDown={me.pageDown.bind(me)}
          pageUp={me.pageUp.bind(me)}
          hasPrevData={hasPrevData}
          hasMoreData={hasMoreData}
        />
      </div>
    );
  }
}

export default Storage;
