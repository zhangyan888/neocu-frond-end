import service from '../../services';
import Tab from '../../components/tab';
import EntityDetailPanel from '../../components/entityDetailPanel';
import EntityDetailCustom from '../../components/entityDetailCustom';
import { error, success } from '../../components/dialog';
import { modal } from './reducers';
import Snapshot from '../../components/snapshot';
import * as action from './actions';
import '../../app/common.less';
import '../../app/commonForm.less';
import '../storage/forms/Form.less';
import './StorageDetail.less';

const { TabPanel } = Tab;
class StorageDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      entity: {},
    };
  }

  parseResData(data) {
    if (!data) {
      return [];
    }
    const items = [
      {
        id: 'overview',
        name: '概况',
        operate: {
          title: '操作',
          options: [
            {
              id: 'editStorage',
              name: '编辑云硬盘',
              disable: false,
              callback: this.editStorage.bind(this),
            }, {
              id: 'deleteStorage',
              name: '删除云硬盘',
              disable: false,
              callback: this.removeStorage.bind(this),
            }, {
              id: 'createSnapshoot',
              name: '创建快照',
              disable: false,
              callback: this.createSnapshoot.bind(this),
            }, {
              id: 'autoSnapshoot',
              name: '自动快照',
              disable: true,
              callback: this.autoSnapshoot.bind(this),
            }, {
              id: 'copyStorage',
              name: '复制云硬盘',
              disable: false,
              callback: this.copyStorage.bind(this),
            },
          ],
        },
        options: [
          {
            id: 'name',
            name: '名称',
            value: data.name,
          }, {
            id: 'id',
            name: 'ID',
            value: data.id,
          }, {
            id: 'description',
            name: '描述',
            value: data.description,
          }, {
            id: 'status',
            name: '状态',
            value: data.status,
          }, {
            id: 'bootable',
            name: '可启用',
            value: data.bootable ? '是' : '否',
          }, {
            id: 'created_at',
            name: '创建时间',
            value: data.created_at,
          }, {
            id: 'autosnapshot_status',
            name: '自动快照状态',
            value: data.autosnapshot_status,
          }, {
            id: 'autosnapshot_cycle',
            name: '自动快照周期',
            value: data.autosnapshot_cycle,
          }, {
            id: 'autosnapshot_time',
            name: '自动快照时间',
            value: data.autosnapshot_time,
          }, {
            id: 'autosnapshot_limit',
            name: '最大保留个数',
            value: String(data.autosnapshot_limit),
          },
        ],
      }, {
        id: 'specs',
        name: '规格',
        operate: {
          title: '操作',
          options: [
            {
              id: 'resizeStorage',
              name: '云硬盘扩容',
              disable: false,
              callback: this.resizeStorage.bind(this),
            },
          ],
        },
        options: [
          {
            id: 'size',
            name: '大小',
            value: String(data.size),
          },
          {
            id: 'volume_type',
            name: '类型',
            value: data.volume_type,
          },
        ],
      }, {
        id: 'Attached devices',
        name: '连接的设备',
        operate: {
          title: '操作',
          options: [
            {
              id: 'manageAttachment',
              name: '管理连接',
              disable: false,
              callback: this.manageConnection.bind(this),
            },
          ],
        },
        options: [
          {
            id: 'attached_to',
            name: '连接到',
            value: data.attached_to,
          },
        ],
      },
    ];
    return items;
  }

  componentDidMount() {
    const id = window.volume_id;
    service.fetchStorage(id)
      .then((res) => {
          console.log(res);
        if (res.ok) {
          this.setState({
            entity: res.data,
          });
          console.log(this.state.entity);
        } else {
          // todo： 错误处理
          console.error(res);
        }
      });
  }

  editStorage() {
    const { entity } = this.state;
    modal.call(this, this.state, action.editStorage(entity));
  }

  removeStorage() {
    console.log('remove storage...')
    const { entity } = this.state;
    modal.call(this, this.state, action.removeStorage(entity && entity.id));
  }

  resizeStorage() {
    console.log('resize storage...')
    const { entity } = this.state;
    modal.call(this, this.state, action.resizeStorage(entity));
  }

  createSnapshoot() {
    console.log('create Snapshoot...')
    const { entity } = this.state;
    modal.call(this, this.state, action.createSnapshoot(entity && entity.id));
  }

  autoSnapshoot() {
    console.log('auto Snapshoot...')
    const { entity } = this.state;
    modal.call(this, this.state, action.autoSnapshoot(entity && entity.id));
  }

  copyStorage() {
    console.log('copy storage...')
    const { entity } = this.state;
    modal.call(this, this.state, action.copyStorage(entity && entity.id));
  }

  manageConnection() {
    console.log('manage Connection storage...')
    const { entity } = this.state;
    modal.call(this, this.state, action.manageConnection(window.volume_id, false));
  }

  render() {
    const { loaded, entity } = this.state;
    let items;
    if (entity && entity.id) {
      items = this.parseResData(entity);
    } else {
      items = this.parseResData();
    }

    return (
      <div className="neo-StorageDetail">
        <EntityDetailPanel items={items} />
        <EntityDetailCustom>
          <Tab defaultKey="snapshot">
            <TabPanel title="云硬盘快照" key="snapshot">
              <Snapshot id={entity && entity.id} />
            </TabPanel>
            <TabPanel title="test" key="test">
              test
            </TabPanel>
          </Tab>
        </EntityDetailCustom>
      </div>
    );
  }
}

export default StorageDetail
