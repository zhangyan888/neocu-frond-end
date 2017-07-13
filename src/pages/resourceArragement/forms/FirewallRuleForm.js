/**
 * Created by ssehacker on 2017/4/7.
 */
import classnames from 'classnames';
import Forms from './Form';
import Table from '../../../components/table';
import Button from '../../../components/button';
import Tab from '../../../components/tab';
import { pick, request } from '../../../util';

const { InputField, Select, Form } = Forms;
const { Option } = Select;
const { TabPanel } = Tab;

class FirewallRuleForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      rules: props.rules || [],
    };
  }

  componentWillMount() {

  }

  handleChange(type, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({
      [type]: value,
    });
  }

  getForm() {
    return this.state.rules;
  }

  isValid() {
    return true;
  }

  handleDelete(value, row, index) {
    let { rules } = this.state;
    rules = rules.filter((rule, id) => id !== row.key);
    this.setState({
      rules,
    });
  }

  render() {
    const me = this;
    const columns = [{
      title: i18n('Protocol'), dataIndex: 'protocol', key: 'protocol', width: 150,
    }, {
      title: i18n('Priority'), dataIndex: 'priority', key: 'priority', width: 150,
    }, {
      title: i18n('Port Range'), dataIndex: 'port-range', key: 'port-range', width: 100,
      render: (value, row, index) => (<span>{[row.port_range_min, row.port_range_max].join('-')}</span>),
    }, {
      title: i18n('Target'), dataIndex: 'remote_up_prefix', key: 'remote_up_prefix', width: 100,
    }, {
      title: i18n('Actions'), dataIndex: 'action', key: 'action', width: 100, render: value => (value === 'accept' ? <span>{i18n('Permit')}</span> : <span>{i18n('Refuse')}</span>),
    }, {
      title: i18n('Action'), dataIndex: 'option', key: 'option', width: 100, render: (value, row, index) => (<Button type="delete" onClick={me.handleDelete.bind(me, value, row, index)}>{i18n('Delete')}</Button>),
    }];
    const { rules } = this.state;
    const egressList = rules.filter(item => item.direction === 'egress').map((item, index) => ({
      ...item,
      key: index,
    }));
    const ingressList = rules.filter(item => item.direction === 'ingress').map((item, index) => ({
      ...item,
      key: index,
    }));
    return (
      <div className={classnames({ 'neo-form-firewall-rules': true })}>
        <Tab defaultKey="egress" ref={(tab) => { this.tab = tab; }}>
          <TabPanel title={i18n('Egress')} key="egress">
            <Table emptyText={() => i18n('No Data')} columns={columns} data={egressList} />
          </TabPanel>
          <TabPanel title={i18n('Ingress')} key="ingress">
            <Table emptyText={() => i18n('No Data')} columns={columns} data={ingressList} />
          </TabPanel>
        </Tab>
      </div>
    );
  }
}


export default FirewallRuleForm;
