/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class OpenVPNForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      protocol: props.protocol || 'udp',
      admin_state_up: props.admin_state_up !== false,
      showRequired: false,
    };
  }

  handleChange(type, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    } else {
      value = e;
    }
    this.setState({
      [type]: value,
    });
  }

  getForm() {
    return {
      ...pick(this.state, 'protocol', 'admin_state_up'),
      ...this.form.getModel(),
    };
  }

  showRequired() {
    this.setState({
      showRequired: true,
    });
  }

  isValid() {
    return this.state.valid;
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
    const { showRequired, protocol, admin_state_up } = this.state;
    const { name, ip_address, limit_connections, port } = this.props;
    return (
      <div className={classnames({ 'neo-form-openvpn': true, 'neo-validated': showRequired })}>
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
            name="ip_address"
            label={i18n('Client Cidr')}
            type="text"
            value={ip_address || ''}
            placeholder="0.0.0.0/0"
            validations="isIP"
            validationError={i18n('Please enter the correct cidr')}
            required
          />
          <InputField
            name="port"
            label={i18n('Port')}
            type="number"
            value={port || 1194}
            placeholder={i18n('Port range is 1-65535')}
            validations={{
              gte: 1,
              lte: 65535,
            }}
            validationError={{
              gte: i18n('Port range is 1-65535'),
              lte: i18n('Port range is 1-65535'),
            }}
            required
          />
          <div className="neo-form-line">
            <Label required>{i18n('Protocol')}</Label>
            <Select
                {...OpenVPNForm.selectCommonConfig}
                value={protocol}
                onChange={me.handleChange.bind(me, 'protocol')}
            >
              <Option key="udp" value="udp">UDP</Option>
              <Option key="tcp" value="tcp">TCP</Option>
            </Select>
          </div>
          <InputField
            name="limit_connections"
            label={i18n('Max Connection')}
            type="number"
            value={limit_connections || '253'}
            placeholder={i18n('Please enter a number between 1~253')}
            validations={{
              gte: 1,
              lte: 253,
            }}
            validationError={{
              gte: i18n('Please enter a number between 1~253'),
              lte: i18n('Please enter a number between 1~253'),
            }}
            required
          />
          <div className="neo-form-line neo-form-checkbox">
            <Input style={{height:'auto', marginTop: '10px'}} type="checkbox" checked={admin_state_up} onChange={me.handleChange.bind(me, 'admin_state_up')} />
            <Label>{i18n('Enable')}</Label>
          </div>
        </Form>
      </div>
    );
  }
}

export default OpenVPNForm;
