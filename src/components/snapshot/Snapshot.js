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
import './Snapshot.less';

const { OptionItem } = Option;
const { CheckBox } = Form;

class Snapshot extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  static propTypes = {
    storageId: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      rows: [],
      hasMoreData: false,
      hasPrevData: false,
      allSelected: false,
    };
    this.init();
  }

  componentDidMount() {
    const { storageId } = this.props;
    service.fetchSnapshots().then((res) => {
      this.handleSnapshotRes(res);
    });
  }

  handleSnapshotRes(res) {
    if (res.ok) {
      const data = res.data;
      const hasMoreData = data.has_more_data;
      const hasPrevData = data.has_prev_data;
      const rows = data.rows;
      console.log(rows);
      this.setState({
        rows,
        hasPrevData,
        hasMoreData,
      });
      if (rows.length) {
        this.firstRowId = rows[0].id;
        this.lastRowId = rows[rows.length - 1].id;
      }
    } else {
      handleResError(res.msg);
    }
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

    service.fetchSnapshots(this.query, lastResourceId, true).then((res) => {
      this.handleSnapshotRes(res);
    });
  }

  pageUp() {
    const { rows } = this.state;
    let firstResourceId;
    if (!rows.length) {
      firstResourceId = this.firstRowId;
    } else {
      firstResourceId = rows[0].id;
    }

    service.fetchSnapshots(this.query, firstResourceId, false).then((res) => {
      this.handleSnapshotRes(res);
    });
  }

  createStorage() {
    modal.call(this, this.state, action.createStorage());
  }

  removeSnapshots() {
    modal.call(this, this.state, action.removeAllSnapshot());
  }

  handleSearch(option, value, e) {
    console.log(`search:${option}:${value}`);
    this.query = [option, value].join('=');
    service.fetchSnapshots(this.query).then((res) => {
      this.handleSnapshotRes(res);
    });
  }

  showDetail(id) {
    modal.call(this, this.state, action.showSnapshotDetail(id));
  }

  getAdminColumns() {

  }

  getColumns() {
    const me = this;
    const { rows, allSelected } = me.state;
    const statusEnume = indexBy(this.statusEnume, 'id');
    const columns = [{
      title: <CheckBox checked={allSelected} onChange={me.toggleAll.bind(me)} />, dataIndex: 'select', key: 'select', width: 50, render: (value, row, index) => {
        return (<CheckBox checked={!!value} onChange={me.toggleRecord.bind(me, index)} />);
      },
    }, {
      title: 'ID', dataIndex: 'id', key: 'id', width: 200, render: (value, row) => (<a href="#" onClick={me.showDetail.bind(me, row.id)}>{value}</a>),
    }, {
      title: '名称', dataIndex: 'name', key: 'name', width: 200, render: (value, row) => (<a href="#" onClick={me.showDetail.bind(me, row.id)}>{value}</a>),
    }, {
      title: '大小', dataIndex: 'size', key: 'size', width: 100, render: (value) => `${value} GB`,
    }, {
      title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (value) => {
        return statusEnume[value].name;
      },
    }, {
      title: '云硬盘名称', dataIndex: 'volume_name', key: 'volume_name', width: 100, render: (value, row, id) => {
        return (<a href={`/project/storage/${row.volume_id}/`}>{value}</a>);
      },
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
      title: '修改时间', dataIndex: 'updated_at', key: 'updated_at', width: 150,
    }, {
      title: '操作', dataIndex: 'actions', key: 'actions', width: 100, render: (value, row, index) => (
        <Option>
          <OptionItem onClick={() => { modal.call(me, me.state, action.createStorage(row)); }}>创建云硬盘</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.editSnapshot(row)); }}>编辑快照</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.removeSnapshot(row.id)); }}>删除云硬盘快照</OptionItem>
          <OptionItem onClick={() => { modal.call(me, me.state, action.rollbackSnapshot(row.id)); }}>回滚云硬盘快照</OptionItem>
        </Option>
      ),
    }];

    return columns;
  }

  init() {
    this.statusEnume = [
      {
        id: 'in-use',
        name: '正在使用',
      },
      {
        id: 'available',
        name: 'available',
      },
      {
        id: 'creating',
        name: 'creating',
      },
      {
        id: 'downloading',
        name: 'downloading',
      },
      {
        id: 'restoring',
        name: 'restoring',
      },
      {
        id: 'error',
        name: 'error',
      },
      {
        id: 'error_extending',
        name: 'maintenance',
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
    let { rows, hasPrevData, hasMoreData } = this.state;
    rows = rows.map(item => ({
      ...item,
      key: item.id,
    }));

    const isDeleteBtnEnable = rows.find(item => item.select);
    return (
      <div className="neo-entity">
        <div className="neo-entity-option m-b">
          <p>
            <Button disabled={!isDeleteBtnEnable} onClick={me.removeSnapshots.bind(me)}>删除云硬盘快照</Button>
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

export default Snapshot;
