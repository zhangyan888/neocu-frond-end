/**
 * Created by ssehacker on 2017/4/5.
 */
import classnames from 'classnames';
import Table from '../../../components/table';
import Button from '../../../components/button';
import Select from '../../../components/select';
import Switch from '../../../components/switch';
import Form from './Form';
import util from '../widgets/util';
import { VM_TYPE, VLAN_TYPE } from '../constant';

const { Option } = Select;
const { Input } = Form;

export default class ListenBackendForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      backend_list: props.backend_list || [],
    };
  }

  handleChange(type, row, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.value;
    } else {
      value = e;
    }
    const { backend_list } = this.state;
    backend_list[row][type] = value;
    if (type === 'vlan') {
      const vms = this.getVMsByVlan(value);
      backend_list[row].vm = (vms.length && vms[0].id) || null;
    }
    this.setState({
      backend_list,
    });
  }

  isValid() {
    // todo
    return true;
  }

  getForm() {
    return this.state.backend_list;
  }

  getVlans() {
    return this.props.ctx.state.blocks.filter(item => item.type === VLAN_TYPE);
  }

  getVMsByVlan(blockId) {
    const ctxState = this.props.ctx.state;
    const { blocks, connections } = ctxState;
    const bks = util.indexBy(blocks, 'id');
    return connections.filter(item => item.from === blockId || item.to === blockId)
      .map((item) => item.from === blockId ? item.to : item.from)
      .map(item => bks[item])
      .filter(item => item.type === VM_TYPE);
  }

  // todo:
  getPolicies() {
    const { policies } = this.props;
    return policies || [];
  }

  createBackend() {
    const { backend_list } = this.state;
    const vlans = this.getVlans();
    const me = this;
    const policies = this.getPolicies();
    let defaultPolicy;
    let vlan;
    let vm;
    if (vlans.length) {
      vlan = vlans[0];
      const vms = this.getVMsByVlan(vlan.id);
      vm = vms.length && vms[0];
    }

    if (!vlan) {
      return;
    }
    if (policies.length > 0){
      defaultPolicy = policies[0].id;
    }
    backend_list.push({
      vlan: vlan.id,
      vm: (vm && vm.id) || null,
      port: 8080,
      type: 'default',
      policy: '' || defaultPolicy,
      weight: 2,
      enabled: true,
    });
    this.setState({
      backend_list,
    });
  }

  renderVlanSelect(value, row, index) {
    const vlans = this.getVlans();
    const me = this;
    if (!vlans.length) {
      return (<span>{i18n('No pravite net,please create')}</span>);
    }
    return (
      <Select
        {...ListenBackendForm.selectCommonConfig}
        value={value}
        onChange={me.handleChange.bind(me, 'vlan', index)}
      >
        {
          vlans.map(item => (<Option key={item.id} value={item.id}>{(item.form && item.form.name) || item.name}</Option>))
        }
      </Select>
    );
  }

  renderVMSelect(value, row, index) {
    const vms = this.getVMsByVlan(row.vlan);
    const me = this;
    return (
      <Select
        {...ListenBackendForm.selectCommonConfig}
        value={value}
        onChange={me.handleChange.bind(me, 'vm', index)}
      >
        {
          vms.map(item => (<Option key={item.id} value={item.id}>{(item.form && item.form.name) || item.name}</Option>))
        }
      </Select>
    );
  }

  renderPort(value, row, index) {
    const me = this;
    return (
      <Input type="number" value={value} onChange={me.handleChange.bind(me, 'port', index)} />
    );
  }

  renderType(value, row, index) {
    const me = this;
    return (
      <Select
        {...ListenBackendForm.selectCommonConfig}
        value={value}
        onChange={me.handleChange.bind(me, 'type', index)}
      >
        <Option key="default" value="default">{i18n('Tacitly Approve')}</Option>
        <Option key="forward" value="forward" className={classnames({ 'neo-hidden': me.isTransport()})}>{i18n('Transpond')}</Option>
      </Select>
    );
  }

  renderPolicy(value, row, index) {
    const me = this;
    const policies = this.getPolicies();
    // console.log('111',policies[0],'222',policies   );
    if (row.type === 'forward') {
      return (
        <Select
          {...ListenBackendForm.selectCommonConfig}
          value={value}
          onChange={me.handleChange.bind(me, 'policy', index)}
        >
          {
            policies.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
          }
        </Select>
      );
    }
    return (<span>-</span>);
  }

  isTransport(){
    const me = this;
    const policies = this.getPolicies();
    return !policies.length;
  }

  renderWeight(value, row, index) {
    const me = this;
    return (
      <Input type="number" value={value} onChange={me.handleChange.bind(me, 'weight', index)} />
    );
  }

  renderEnable(value, row, index) {
    const me = this;
    return (
      <Switch onChange={me.handleChange.bind(me, 'enabled', index)}
        checked={value}
        checkedChildren={i18n('Y','Orchestrates')}
        unCheckedChildren={i18n('N','Orchestrates')}
      />
    );
  }

  renderOption(value, row, index) {
    const me = this;
    return (
      <Button type="delete" className="neo-delete-btn" onClick={me.handleDelete.bind(me, row)}>{i18n('Delete')}</Button>
    );
  }

  handleDelete(row) {
    const { backend_list } = this.state;
    backend_list.splice(row, 1);
    this.setState({
      backend_list,
    });
  }



  render() {
    const me = this;
    const columns = [{
      title: i18n('Private Network'), dataIndex: 'vlan', key: 'vlan', width: 150, render: me.renderVlanSelect.bind(me),
    }, {
      title: i18n('Instance'), dataIndex: 'vm', key: 'vm', width: 150, render: me.renderVMSelect.bind(me),
    }, {
      title: i18n('Port Number'), dataIndex: 'port', key: 'port', width: 100, render: me.renderPort.bind(me),
    }, {
      title: i18n('Type'), dataIndex: 'type', key: 'type', width: 100, render: me.renderType.bind(me),
    }, {
      title: i18n('Policy'), dataIndex: 'policy', key: 'policy', width: 100, render: me.renderPolicy.bind(me),
    }, {
      title: i18n('Weight'), dataIndex: 'weight', key: 'weight', width: 100, render: me.renderWeight.bind(me),
    }, {
      title: i18n('enable','Orchestrates'), dataIndex: 'enabled', key: 'enabled', width: 100, render: me.renderEnable.bind(me),
    }, {
      title: i18n('Action'), dataIndex: 'option', key: 'option', width: 100, render: me.renderOption.bind(me),
    }];

    const { backend_list } = this.state;
    const backendList = backend_list.map((item, index) => ({
      ...item,
      key: index,
    }));

    const hasError = !me.getVlans().length;

    return (
      <div className={classnames({ 'neo-form-table': true, 'neo-form': true })}>
        <div className="neo-form-table-header">
          <Button
            className="neo-form-create-btn"
            onClick={me.createBackend.bind(me)}
            disabled={hasError}
          >
            {i18n('New')}
          </Button>
          <span className={classnames({ 'neo-hidden': !hasError })}>{i18n('No can be added backend,please create new private network and instance associated with at least one cloud')}</span>
        </div>
        <Table emptyText={() => i18n('No Data')} columns={columns} data={backendList} />
      </div>
    );
  }
}
