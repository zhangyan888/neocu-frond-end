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

export default class PPTPUsersForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    let users = props.users || [];
    users = JSON.parse(JSON.stringify(users));
    this.state = {
      users,
      errMsg: '',
      errLineNumber: -1,
      errField: '',
    };
  }

  validate() {
    let err;
    let errField;
    const { users } = this.state;
    let i;
    for (i = 0; i < users.length; i++) {
      const user = users[i];

      if (user.username.length === 0) {
        err = i18n('Please enter a username');
        errField = 'username';
      } else if (this.isReduplicate(users, user.username)) {
        err = i18n('User name cannot be repeated');
        errField = 'username';
      } else if (user.password.length < 5) {
        err = i18n('Password length is not less than five');
        errField = 'password';
      }

      if (err) {
        break;
      }
    }
    return {
      errLineNumber: err ? i : -1,
      errMsg: err,
      errField,
    };
  }

  isReduplicate(users, userName) {
    return users.filter(item => item.username === userName).length > 1;
  }

  handleChange(type, row, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.value;
    } else {
      value = e;
    }
    const { users, errMsg } = this.state;
    users[row][type] = value;
    const err = this.validate(type, row);
    this.setState({
      users,
      ...err,
    });
  }

  isValid() {
    const res = this.validate();
    return !res.errMsg;
  }

  getForm() {
    return this.state.users;
  }

  createUser() {
    const { users } = this.state;

    users.push({
      username: '',
      password: '',
      user_ip_address: '',
    });
    this.setState({
      users,
    });
  }

  applyWhileValidationError() {
    const res = this.validate();
    this.setState(res);
  }

  renderUsername(value, row, index) {
    const me = this;
    const { errField, errLineNumber } = this.state;
    return (
      <Input
        className={classnames({ 'neo-form-table-error': index === errLineNumber && errField === 'username' })}
        type="text"
        placeholder={i18n('Please enter a username')}
        value={value}
        onChange={me.handleChange.bind(me, 'username', index)}
      />
    );
  }

  renderPassword(value, row, index) {
    const me = this;
    const { errField, errLineNumber } = this.state;
    return (
      <Input
        type="text"
        value={value}
        placeholder={i18n('Password length is not less than five')}
        className={classnames({ 'neo-form-table-error': index === errLineNumber && errField === 'password' })}
        onChange={me.handleChange.bind(me, 'password', index)}
      />
    );
  }

  renderUserIPAddress(value, row, index) {
    const me = this;
    const { errField, errLineNumber } = this.state;
    return (
      <Input
        type="text"
        value={value}
        placeholder={i18n('Please enter the assigned ip address')}
        className={classnames({ 'neo-form-table-error': index === errLineNumber && errField === 'user_ip_address' })}
        onChange={me.handleChange.bind(me, 'user_ip_address', index)}
      />
    );
  }

  renderOption(value, row, index) {
    const me = this;
    return (
      <Button type="delete" className="neo-delete-btn" onClick={me.handleDelete.bind(me, row)}>{i18n('DELETE')}</Button>
    );
  }

  handleDelete(row) {
    let { users, errMsg } = this.state;
    if (users.length < 2) {
      errMsg = i18n('Can not delete the last PPTPVPN users. If the router is no longer use PPTPVPN, please use the right-click menu on the PPTPVPN icon to delete this module');
      this.setState({
        errMsg,
      });
      return;
    }
    users.splice(row.key, 1);
    this.setState({
      users,
    });
  }

  render() {
    const me = this;
    const columns = [{
      title: i18n('User Name'), dataIndex: 'username', key: 'username', width: 200, render: me.renderUsername.bind(me),
    }, {
      title: i18n('Password'), dataIndex: 'password', key: 'password', width: 200, render: me.renderPassword.bind(me),
    }, {
      title: i18n('User Assigned IP'), dataIndex: 'user_ip_address', key: 'user_ip_address', width: 200, render: me.renderUserIPAddress.bind(me),
    }, {
      title: i18n('Action'), dataIndex: 'option', key: 'option', width: 150, render: me.renderOption.bind(me),
    }];

    let { users, errMsg, errLineNumber } = this.state;
    users = users.map((item, index) => ({
      ...item,
      key: index,
    }));

    return (
      <div className={classnames({ 'neo-form-table': true, 'neo-form': true, 'neo-form-pptp-users': true })}>
        <div className="neo-form-table-header">
          <Button
            className="neo-form-create-btn"
            onClick={me.createUser.bind(me)}
          >
            {i18n('New')}
          </Button>
          <p className="neo-form-table-err-msg">{errMsg}</p>
        </div>
        <Table emptyText={() => i18n('No Data')} columns={columns} data={users} />
      </div>
    );
  }
}
