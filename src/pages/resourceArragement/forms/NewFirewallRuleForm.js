/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';
import { util } from '../widgets';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class FirewallRuleForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      showRequired: false,
      direction: props.direction || 'egress',
      action: props.action || 'accept',
      protocol: props.protocol || 'tcp',
      port_range_min: props.port_range_min || '1',
      port_range_max: props.port_range_max || '65535',
      rangeHasErr: false,
    };
  }

  componentWillMount() {
    request.get('/api/neutron/flat_networks/')
      .then((res) => {
        this.setState({
          extNetIdOption: res.items,
          ext_net_id: this.state.ext_net_id || res.items[0].id,
        });
      })
      .catch(util.handleResError);
  }

  handleChange(type, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.value;
    } else {
      value = e;
    }
    let rangeHasErr = this.state.rangeHasErr;
    if (type === 'port_range_min') {
      const max = window.parseInt(this.state.port_range_max);
      const min = window.parseInt(value);
      if (1 <= min <= max) {
        rangeHasErr = true;
      } else {
        rangeHasErr = false;
      }
    } else if (type === 'port_range_max') {
      const max = window.parseInt(value);
      const min = window.parseInt(this.state.port_range_min);
      if (max >= min && max <= 65535) {
        rangeHasErr = false;
      } else {
        rangeHasErr = true;
      }
    }
    this.setState({
      [type]: value,
      rangeHasErr,
    });
  }

  getForm() {
    return {
      ...pick(this.state, 'direction', 'action', 'protocol', 'port_range_min', 'port_range_max'),
      ...this.form.getModel(),
    };
  }

  showRequired() {
    this.setState({
      showRequired: true,
    });
  }

  isValid() {
    return this.state.valid && !this.state.rangeHasErr;
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

  setDefaultValue(protocol, port_range_min, port_range_max) {
    this.setState({
      protocol,
      port_range_min,
      port_range_max,
    });
  }

  isICMP(protocol) {
    return protocol === 'icmp';
  }

  render() {
    const me = this;
    const { direction, action, protocol, showRequired, port_range_min, port_range_max, rangeHasErr } = this.state;
    const { priority, remote_up_prefix } = this.props;
    return (
      <div className={classnames({ 'neo-form-firewall-rule': true, 'neo-validated': showRequired })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <div className="neo-form-line">
            <Label>{i18n('Usual Rule')}</Label>
            <div className="neo-tmpl">
              <a onClick={me.setDefaultValue.bind(me, 'tcp', '1', '65535')}>ALL TCP</a>
              <a onClick={me.setDefaultValue.bind(me, 'udp', '1', '65535')}>ALL UDP</a>
              <a onClick={me.setDefaultValue.bind(me, 'tcp', '22', '22')}>SSH</a>
              <a onClick={me.setDefaultValue.bind(me, 'tcp', '80', '80')}>HTTP</a>
              <a onClick={me.setDefaultValue.bind(me, 'tcp', '443', '443')}>HTTPS</a>
              <a onClick={me.setDefaultValue.bind(me, 'tcp', '20', '21')}>FTP</a>
              <a onClick={me.setDefaultValue.bind(me, 'tcp', '3306', '3306')}>MYSQL</a>
            </div>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Type')}</Label>
            <Select
              {...FirewallRuleForm.selectCommonConfig}
              value={direction}
              onChange={me.handleChange.bind(me, 'direction')}
            >
              <Option key="egress" value="egress">{i18n('Egress')}</Option>
              <Option key="ingress" value="ingress">{i18n('Ingress')}</Option>
            </Select>
          </div>
          <InputField
            name="priority"
            label={i18n('Priority')}
            type="number"
            value={priority || '1'}
            placeholder={i18n('Smaller values representing higher priorities')}
            validations="gte:1"
            validationError={i18n('Please enter a number not less than 1')}
            required
          />
          <div className="neo-form-line">
            <Label required>{i18n('Actions')}</Label>
            <Select
              {...FirewallRuleForm.selectCommonConfig}
              value={action}
              onChange={me.handleChange.bind(me, 'action')}
            >
              <Option key="accept" value="accept">{i18n('Permit')}</Option>
              <Option key="drop" value="drop">{i18n('Refuse')}</Option>
            </Select>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Protocol')}</Label>
            <Select
              {...FirewallRuleForm.selectCommonConfig}
              value={protocol}
              onChange={me.handleChange.bind(me, 'protocol')}
            >
              <Option key="tcp" value="tcp">TCP</Option>
              <Option key="udp" value="udp">UDP</Option>
              <Option key="icmp" value="icmp">ICMP</Option>
              <Option key="all" value="all">ALL</Option>
            </Select>
          </div>
          <div className={classnames({ 'neo-form-line': true, 'neo-hidden': me.isICMP(protocol) })}>
            <Label required>{i18n('Port Range')}</Label>
            <div className="neo-port-range">
              <Input
                value={port_range_min}
                type="number"
                placeholder={i18n('Port Range Is 1-65535')}
                onChange={me.handleChange.bind(me, 'port_range_min')}
              />
              <span>-</span>
              <Input
                value={port_range_max}
                type="number"
                placeholder={i18n('Port Range Is 1-65535')}
                onChange={me.handleChange.bind(me, 'port_range_max')}
              />
            </div>
            <p className="neo-port-range-err-msg">
              <span className={classnames({ 'neo-hidden': !rangeHasErr })}>{i18n('Please enter the correct port range')}</span>
            </p>
          </div>
          <InputField
            name="remote_up_prefix"
            label={i18n('Target')}
            type="text"
            value={remote_up_prefix || ''}
            placeholder="0.0.0.0/0"
            validations="isIP"
            validationError={i18n('Please enter the correct IP')}
          />
        </Form>
      </div>
    );
  }
}

export default FirewallRuleForm;
