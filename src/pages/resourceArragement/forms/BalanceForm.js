/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick } from '../../../util';

const { InputField, Select, Form } = Forms;
const { Option } = Select;

class BalanceForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    const vlans = this.getVlans();
    // console.log(vlans);
    this.state = {
      valid: false,
      showRequired: false,
      type: props.type || 'high-availability',
      ha_subnet_id: props.ha_subnet_id || (vlans[0] && String(vlans[0].id) || ''),
      replicas: props.replicas || '1',
      haSubnetIdOption: vlans,
    };
  }

  getVlans() {
    return this.props.ctx.state.blocks.filter(item => item.type === 'Vlan');
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
    return {
      ...pick(this.state, 'type', 'ha_subnet_id', 'replicas'),
      ...this.form.getModel(),
    };
  }

  showRequired() {
    this.setState({
      showRequired: true,
    });
  }

  isValid() {
    const { valid, type, haSubnetIdOption } = this.state;

    if (type === 'high-availability') {
      return valid && !!haSubnetIdOption.length;
    }
    return valid;
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

  render() {
    const me = this;
    const { type, replicas, ha_subnet_id, haSubnetIdOption, showRequired } = this.state;
    const { name, maxconn } = this.props;
    return (
      <div className={classnames({ 'neo-form-banalce': true, 'neo-validated': showRequired })}>
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
          <div className="neo-form-line">
            <Label required>{i18n('Type')}</Label>
            <Select
              {...BalanceForm.selectCommonConfig}
              value={type}
              onChange={me.handleChange.bind(me, 'type')}
              disabled
            >
              <Option key="normal" value="normal">{i18n('General')}</Option>
              <Option key="high-availability" value="high-availability">{i18n('HA')}</Option>
            </Select>
          </div>
          <InputField
            name="maxconn"
            label={i18n('Max Connection')}
            type="number"
            value={maxconn || 1000}
            placeholder={i18n('Please enter a number not less than 1')}
            validations="gte:1"
            validationError={i18n('Please enter a number not less than 1')}
            required
          />
          <div className={classnames({ 'neo-form-line': true, 'neo-form-balance-ha': true, 'neo-hidden': type === 'normal' })}>
            <Label required>{i18n('HA Subnet')}</Label>
            <Select
              {...BalanceForm.selectCommonConfig}
              value={ha_subnet_id}
              onChange={me.handleChange.bind(me, 'ha_subnet_id')}
              disabled={!haSubnetIdOption.length}
            >
              {
                haSubnetIdOption.map(item =>
                  (
                    <Option key={String(item.id)} value={String(item.id)}>
                      {(item.form && item.form.name) || item.name}
                    </Option>
                  )
                )
              }
            </Select>
            <div className="neo-form-error">{!haSubnetIdOption.length && i18n('There is no available subnet,create private network first, please')}</div>
          </div>
          <div className={classnames({ 'neo-form-line': true, 'neo-hidden': type === 'normal' })}>
            <Label required>{i18n('Backup Copies')}</Label>
            <Select
              {...BalanceForm.selectCommonConfig}
              value={replicas}
              onChange={me.handleChange.bind(me, 'replicas')}
            >
              <Option key="1" value="1">1</Option>
              <Option key="2" value="2">2</Option>
              <Option key="3" value="3">3</Option>
            </Select>
          </div>
        </Form>
      </div>
    );
  }
}

export default BalanceForm;
