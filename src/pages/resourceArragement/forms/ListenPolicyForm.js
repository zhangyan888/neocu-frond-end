/**
 * Created by ssehacker on 2017/4/5.
 */
import classnames from 'classnames';
import Table from '../../../components/table';
import Button from '../../../components/button';
import Collapse from '../../../components/collapse';
import Label from '../../../components/label';
import Forms from './Form';
import { pick } from '../../../util';
import util from '../widgets/util';
import { VM_TYPE, VLAN_TYPE } from '../constant';


const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;
const { Panel } = Collapse;

class PolicyPanel extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      rules: props.rules || [],
      condition_op: props.condition_op || 'all',
    };
  }

  handleValid() {
    this.setState({
      valid: true,
    });
  }

  handleInvalid() {
    this.setState({
      valid: false,
    });
  }

  isValid() {
    // todo
    return this.state.valid;
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

  handleRuleChange(type, row, e) {
    let value;
    const { rules } = this.state;
    if (typeof e === 'object') {
      value = e.target.value;
    } else {
      value = e;
    }
    rules[row][type] = value;
    if (type === 'ruleType' && value === 'Method') {
      rules[row].compare_op = 'EqualToStr';
      rules[row].value = 'get';
    } else if (type === 'ruleType' && value === 'Path') {
      rules[row].value = '';
    }
    this.setState({
      rules,
    });
  }

  getForm() {
    const { id } = this.props;
    return {
      id,
      ...pick(this.state, 'condition_op', 'rules'),
      ...this.form.getModel(),
    };
  }

  createRule() {
    const { rules } = this.state;
    rules.push({
      compare_op: 'EqualToStr',
      ruleType: 'Method',
      value: 'get',
      valueType: 'string',
    });
    this.setState({
      rules,
    });
  }

  deleteRule(row) {
    let { rules } = this.state;
    rules = rules.filter((item, index) => index !== row);
    this.setState({
      rules,
    });
  }

  renderRuleType(value, row, index) {
    const me = this;
    return (
      <Select
        {...PolicyPanel.selectCommonConfig}
        value={value}
        onChange={me.handleRuleChange.bind(me, 'ruleType', index)}
        dropdownClassName="neo-dropdown-mini"
      >
        <Option key="Method" value="Method">{i18n('According to the method transpond')}</Option>
        <Option key="Path" value="Path">{i18n('According to the URL transpond')}</Option>
      </Select>
    );
  }

  renderValueType(value, row, index) {
    const me = this;
    return (
      <Select
        {...PolicyPanel.selectCommonConfig}
        value={value}
        disabled
        dropdownClassName="neo-dropdown-mini"
        onChange={me.handleRuleChange.bind(me, 'valueType', index)}
      >
        <Option key="string" value="string">{i18n('String')}</Option>
        <Option key="number" value="number">{i18n('Number','Orchestrates')}</Option>
      </Select>
    );
  }

  renderCompareOp(value, row, index) {
    const me = this;
    return (
      <Select
        {...PolicyPanel.selectCommonConfig}
        value={value}
        disabled={row.ruleType === 'Method'}
        dropdownClassName="neo-dropdown-mini"
        onChange={me.handleRuleChange.bind(me, 'compare_op', index)}
      >
        <Option key="BeginWith" value="BeginWith">{i18n('Begin With')}</Option>
        <Option key="EndWith" value="EndWith">{i18n('End With')}</Option>
        <Option key="EqualToStr" value="EqualToStr">{i18n('Equal')}</Option>
        <Option key="Contain" value="Contain">{i18n('Include')}</Option>
      </Select>
    );
  }

  renderRuleValue(value, row, index) {
    const me = this;
    if (row.ruleType === 'Method') {
      return (
        <Select
          {...PolicyPanel.selectCommonConfig}
          value={value}
          dropdownClassName="neo-dropdown-mini"
          onChange={me.handleRuleChange.bind(me, 'value', index)}
        >
          <Option key="get" value="get">GET</Option>
          <Option key="head" value="head">HEAD</Option>
          <Option key="post" value="post">POST</Option>
          <Option key="put" value="put">PUT</Option>
          <Option key="delete" value="delete">DELETE</Option>
          <Option key="trace" value="trace">TRACE</Option>
          <Option key="options" value="options">OPTIONS</Option>
        </Select>
      );
    } else {
      return (<Input value={value} onChange={me.handleRuleChange.bind(me, 'value', index)} />);
    }
  }

  renderRules() {
    const me = this;
    const columns = [{
      title: i18n('Rule Type'), dataIndex: 'ruleType', key: 'ruleType', width: 127, render: me.renderRuleType.bind(me),
    }, {
      title: i18n('Compare Type'), dataIndex: 'valueType', key: 'valueType', width: 100, render: me.renderValueType.bind(me),
    }, {
      title: i18n('Compare the Way'), dataIndex: 'compare_op', key: 'compare_op', width: 100, render: me.renderCompareOp.bind(me),
    }, {
      title: i18n('Content Rules'), dataIndex: 'value', key: 'value', width: 100, render: me.renderRuleValue.bind(me),
    }, {
      title: i18n('Action'), dataIndex: 'option', key: 'option', width: 79, render: me.renderOption.bind(me),
    }];

    let { rules } = this.state;
    rules = rules.map((item, index) => ({
      ...item,
      key: index,
    }));
    return (
      <div className="neo-form-table-policy">
        <Table emptyText={() => i18n('No Data')} columns={columns} data={rules} />
        <p onClick={me.createRule.bind(me)} className="neo-form-rule-new-btn">
          <i className="iconfont icon-plus" />
          <span>{i18n('Add Rule')}</span>
        </p>
      </div>
    );
  }

  renderOption(value, row, index) {
    const me = this;
    return (
      <Button type="delete" className="neo-delete-btn" onClick={me.deleteRule.bind(me, index)}>{i18n('Delete')}</Button>
    );
  }

  render() {
    const me = this;
    const { condition_op } = this.state;
    const { name, index } = this.props;
    return (
      <div className={classnames({ 'neo-form-policy': true })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <InputField
            name="name"
            label={i18n('Name')}
            type="text"
            value={name || ''}
            placeholder={i18n('Please enter a name')}
            validations={{
              maxLength: 20,
              minLength: 2,
              isName: true,
            }}
            validationErrors={{
              maxLength: i18n('Please enter 2-20 characters, support the English case, numbers, and the underscore Chinese'),
              minLength: i18n('Please enter 2-20 characters, support the English case, numbers, and the underscore Chinese'),
              isName: i18n('Please enter 2-20 characters, support the English case, numbers, and the underscore Chinese'),
            }}
            required
          />
          <InputField
            name="index"
            label={i18n('Priority')}
            type="number"
            value={index || 1}
            placeholder={i18n('Please enter a number not less than 1')}
            validations="gte:1"
            validationError={i18n('Please enter a number not less than 1')}
            required
          />
          <div className="neo-form-line">
            <Label required>{i18n('Operating Conditions')}</Label>
            <Select
              {...PolicyPanel.selectCommonConfig}
              value={condition_op}
              onChange={me.handleChange.bind(me, 'condition_op')}
            >
              <Option key="all" value="all">{i18n('Meet all the rules')}</Option>
              <Option key="any" value="any">{i18n('Meet any of the rules')}</Option>
            </Select>
          </div>
        </Form>
        {me.renderRules()}
      </div>
    );
  }
}

export default class ListenPolicyForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.pforms = [];
    this.state = {
      policies: props.policies || [],
      activeKey: ((props.policies && props.policies[0]) && props.policies[0].id) || '',
      showRequired: false,
    };
  }

  isValid() {
    // todo
    return this.pforms.filter(item => !!item)
      .reduce((pre, val) => {
        return pre && val.isValid();
      }, true);
  }

  getForm() {
    const renderedForms = this.pforms.filter(item => !!item).map((form) => {
      return form.getForm();
    });

    const rfs = util.indexBy(renderedForms, 'id');
    let { policies } = this.state;
    return policies.map((item) => {
      const rf = rfs[item.id];
      if (rf) {
        return {
          ...rf,
        };
      }
      return item;
    });
  }

  createBackend() {
    const { policies } = this.state;
    const id = `policy${Date.now()}`;
    policies.push({
      name: '',
      id,
      index: '',
      condition_op: 'all',
      rules: [{
        compare_op: 'EqualToStr',
        ruleType: 'Method',
        value: 'get',
        valueType: 'string',
      }],
    });
    this.setState({
      policies,
    });
    // 动画效果.
    setTimeout(() => {
      this.setState({
        activeKey: id,
      });
    }, 100);
  }

  showRequired() {
    let form;
    for (let i = 0; i < this.pforms.length; i++) {
      form = this.pforms[i];
      if (form && !form.isValid()) {
        break;
      }
    }
    this.setState({
      showRequired: true,
      activeKey: form.getForm().id,
    });
  }

  onChange(activeKey) {
    this.setState({
      activeKey,
    });
  }

  handleDelete(id, e) {
    e.stopPropagation();
    let { policies } = this.state;
    policies = policies.filter(item => item.id !== id);
    this.setState({
      policies,
    });
  }

  renderPanels() {
    const { policies } = this.state;
    const me = this;
    return policies.map((item, index) => {
      const header = (<p>
        <b>{item.name || i18n('New Protocal')}</b>
        <i onClick={me.handleDelete.bind(me, item.id)} className="iconfont icon-shanchu" />
      </p>);
      return (
       <Panel key={item.id} header={header}>
         <PolicyPanel ref={(node) => { me.pforms[index] = node; }} {...item} />
       </Panel>
     );
    });
  }

  renderBody() {
    const { policies, activeKey } = this.state;
    const me = this;
    if (!policies.length) {
      return (
        <Button
          className="neo-form-create-btn neo-btn-center"
          onClick={me.createBackend.bind(me)}
        >
          {i18n('New')}
        </Button>
      );
    }

    return (
      <div>
        <Button
          className="neo-form-create-btn"
          onClick={me.createBackend.bind(me)}
        >
          {i18n('New')}
        </Button>
        <Collapse
          accordion={true}
          onChange={me.onChange.bind(me)}
          activeKey={activeKey}
        >
          {me.renderPanels()}
        </Collapse>
      </div>
    );
  }

  render() {
    const me = this;
    const { showRequired } = this.state;

    return (
      <div className={classnames({ 'neo-form-listen-policy': true, 'neo-validated': showRequired })}>
        {me.renderBody()}
      </div>
    );
  }
}

