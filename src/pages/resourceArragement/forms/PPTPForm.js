/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class PPTPForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      description: props.description || '',
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
    const { name, ip_address, limit_connections, username, password, user_ip_address } = this.form.getModel();
    const users = this.props.users || [];
    users[0] = {
      username,
      password,
      user_ip_address,
    };
    return {
      ...pick(this.state, 'description', 'admin_state_up'),
      name,
      ip_address,
      limit_connections,
      users,
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
    const { showRequired, description, admin_state_up } = this.state;
    const { name, ip_address, limit_connections, users } = this.props;
    const user = users && users[0];
    let username;
    let password;
    let user_ip_address;
    if (user) {
      username = user.username;
      password = user.password;
      user_ip_address = user.user_ip_address;
    }
    return (
      <div className={classnames({ 'neo-form-pptp': true, 'neo-validated': showRequired })}>
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
          <InputField
            name="username"
            label={i18n('User Name')}
            type="text"
            value={username || ''}
            placeholder={i18n('Please enter a username')}
            required
          />
          <InputField
            name="password"
            label={i18n('Password')}
            type="password"
            value={password || ''}
            validations="minLength:5"
            validationError={i18n('Password length is not less than five')}
            placeholder={i18n('Please input your password')}
            required
          />
          <InputField
            name="user_ip_address"
            label={i18n('User Assigned IP')}
            type="text"
            value={user_ip_address || ''}
            placeholder={i18n('Please enter the user assigned ip address')}
          />
          <div className="neo-form-line">
            <Label>{i18n('Description')}</Label>
            <textarea className="neo-textarea" value={description} onChange={me.handleChange.bind(me, 'description')}></textarea>
          </div>
          <div className="neo-form-line neo-form-checkbox">
            <Input type="checkbox" checked={admin_state_up} onChange={me.handleChange.bind(me, 'admin_state_up')} />
            <Label>{i18n('Enabled','Orchestrates')}</Label>
          </div>
        </Form>
      </div>
    );
  }
}

export default PPTPForm;
